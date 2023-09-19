//deck

const deckGetAllQuery = `select d.deck_id,d.name,d.difficultylevel,d.card_count,i.image_url from deck d  left join images i on d.image_id=i.image_id where d.bu_id=$1 group by d.deck_id,i.image_url;`;
const editeGetAlldecks = `SELECT d.deck_id AS "deckId", d.name AS "deckName", d.difficultylevel AS "difficultyLevel", COUNT(*) FILTER (WHERE c.visibility = true AND d.visibility = true) AS "cardCount",COALESCE(i.image_url, di.image_url) AS "deckImage", COALESCE(i.image_id, di.image_id) AS "deckImageId" FROM deck d LEFT JOIN images i ON d.image_id = i.image_id LEFT JOIN default_images di ON d.default_image_id = di.image_id LEFT JOIN card c ON d.deck_id = c.deck_id
WHERE d.deck_id NOT IN (SELECT sdr.deck_id FROM section_deck_ref sdr WHERE sdr.section_id = $1 AND d.bu_id = $2) GROUP BY d.deck_id,d.name,d.difficultylevel,i.image_url,di.image_url,i.image_id,di.image_id`
const deckandCardGetByIdQuery = `SELECT d.bu_id,d.deck_id,d.name,d.image_id,di.image_url AS deck_image_url,d.difficultylevel,d.visibility,d.card_count,d.subject,d.topic,d.sub_topic,d.exam,d.standard,c.card_id,c.question,c.type,c.solution,c.hint,c.option1,c.option2,c.option3,c.option4,c.option5,c.visibility as card_visibility, (SELECT image_url FROM images WHERE image_id = d.image_id) AS deck_image,(SELECT image_url FROM images WHERE image_id = c.question_image) AS question_image, (SELECT image_url FROM images WHERE image_id = c.hint_image) AS hint_image, (SELECT image_url FROM images WHERE image_id = c.option1_image) AS option1_image, (SELECT image_url FROM images WHERE image_id = c.option2_image) AS option2_image,(SELECT image_url FROM images WHERE image_id = c.option3_image) AS option3_image,(SELECT image_url FROM images WHERE image_id = c.option4_image) AS option4_image,(SELECT image_url FROM images WHERE image_id = c.option5_image) AS option5_image FROM deck d JOIN card c ON d.deck_id = c.deck_id left join images di on d.image_id = di.image_id where d.deck_id = $1 and d.bu_id=$2 order by c.card_id`;
const deckGetByIdQuery = `select d.deck_id,d.name,d.difficultylevel,d.image_id,i.image_url as image,d.subject,d.topic,d.sub_topic,d.exam,d.standard from deck as d left join images i  ON d.image_id = i.image_id where deck_id=$1 and bu_id=$2`;
const deckDeleteByIdQuery = `delete from deck where deck_id=$1 returning image_id`;
const cardCountGetByDeckIdQuery = `select card_count from deck where deck_id=$1`
const deckSearchQuery = `select deck_id,name,difficultylevel,image_id,card_count from deck where name ilike $1 or subject ilike $1 or topic ilike $1 or sub_topic ilike $1 or exam ilike $1 or standard ilike $1 `
const deckAddQuery = `insert into deck(bu_id,name,difficultylevel,subject,topic,sub_topic,exam,standard,visibility,image_id,file_link,created_at,created_by,card_count,default_image_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) returning deck_id`;
const deckUpdateQuery = `update deck set name=$1,difficultylevel=$2,subject=$3,topic=$4,sub_topic=$5,exam=$6,standard=$7,updated_at=$8,updated_by=$9 where deck_id=$10 and bu_id=$11 returning deck_id`
const updateDeckVisibilityByIdQuery = `update deck set visibility=$2,updated_by=$3,updated_at=$4 where deck_id=$1 and bu_id=$5`;
const cardCountUpdateQuery = `update deck set card_count=card_count+$2 where deck_id=$1 returning deck_id `;
const deckCoverImageDeleteQuery = `with deleted_ids AS(delete from images where image_url=$2 returning image_id)update deck set image_id=NULL where deck_id=$1 and image_id in (select image_id from deleted_ids)`
const deckCoverImageDelete = `update deck set image_id=NULL,updated_by=$4 where deck_id=$1 and image_id=$2 and bu_id=$3 returning deck_id`;
const getMyDeck = `SELECT COUNT(rd.card_id) FROM revision_deck rd JOIN card c ON rd.card_id = c.card_id JOIN deck d ON c.deck_id = d.deck_id WHERE rd.bu_id = $1  AND rd.user_id = $2   AND d.visibility = true   AND c.visibility = true`
const getFavorite = "SELECT COUNT(fd.card_id) FROM favourite_deck fd JOIN card c ON fd.card_id = c.card_id JOIN deck d ON c.deck_id = d.deck_id WHERE fd.bu_id = $1  AND fd.user_id = $2   AND d.visibility = true   AND c.visibility = true";
const updateDeckCoverImageQuery = `update deck set image_id=$1,updated_by=$4,updated_at=$5 where deck_id=$2 and bu_id=$3`;
const searchDeckByNameQuery = `select deck_id,name from deck  where  name ilike $1 or subject ilike $1 or topic ilike $1 or sub_topic ilike $1 or standard ilike $1 or exam ilike $1 and bu_id=$2`
const trendingSearchDeckByNameQuery = `select deck_id as "deckId",name as "deckName" from deck  where (name ilike $1 or subject ilike $1 or topic ilike $1 or sub_topic ilike $1 or standard ilike $1 or exam ilike $1) and bu_id=$2 and visibility=true`;
const getAllDeckByNameQuery = `SELECT d.deck_id,d.name,d.difficultylevel,d.card_count,d.image_id, COALESCE(i.image_url, di.image_url) AS image_url FROM deck d LEFT JOIN images i ON d.image_id = i.image_id LEFT JOIN default_images di ON d.default_image_id = di.image_id WHERE d.deck_id = $1 AND d.bu_id = $2 `
const checkDeckIdExistQuery = `SELECT EXISTS (SELECT 1 FROM section_deck_ref WHERE deck_id = $1) AS deck_exists`
const removeSectionRefByIdQuery = `delete from section_deck_ref Where deck_id = $1 AND section_id IN (select section_id from section_deck_ref GROUP BY section_id HAVING COUNT(DISTINCT deck_id) > 1) returning deck_id`
const getCardByDeckIdQuery = `select card_id,question_image,hint_image,option1_image,option2_image,option3_image,option4_image,option5_image from card where deck_id=$1`
const updateCardCount = `update deck set card_count=card_count-1 where deck_id=$1`
const searchQueryForGetDeckName = `select d.deck_id,d.name from deck d where (d.name ilike $2 or subject ilike $2 or topic ilike $2 or sub_topic ilike $2 or standard ilike $2 or exam ilike $2) and d.deck_id not in(select s.deck_id from section_deck_ref s where s.section_id=$1) and bu_id=$3`
const getRandomImage = `select * from default_images order by random() limit 1`

//card
const cardAddQuery = `insert into card(bu_id,question,question_image,solution,option1,option2,option3,option4,option5,option1_image,option2_image,option3_image,option4_image,option5_image,hint,hint_image,visibility,created_at,created_by,deck_id,type) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21) returning card_id`;
const cardGetAllQuery = `select * from card where card_id=$1`
const cardGetByIdQuery = `SELECT c.card_id,c.question, (SELECT json_build_object('image_id', image_id, 'image_url', image_url) FROM images WHERE image_id = c.question_image) AS question_image,c.solution,c.option1,(SELECT json_build_object('image_id', image_id, 'image_url', image_url) FROM images WHERE image_id = c.option1_image) AS option1_image,c.option2,(SELECT json_build_object('image_id', image_id, 'image_url', image_url) FROM images WHERE image_id = c.option2_image) AS option2_image,c.option3,(SELECT json_build_object('image_id', image_id, 'image_url', image_url) FROM images WHERE image_id = c.option3_image) AS option3_image,c.option4,(SELECT json_build_object('image_id', image_id, 'image_url', image_url) FROM images WHERE image_id = c.option4_image) AS option4_image,c.option5,(SELECT json_build_object('image_id', image_id, 'image_url', image_url) FROM images WHERE image_id = c.option5_image) AS option5_image,c.hint,c.type,(SELECT json_build_object('image_id', image_id, 'image_url', image_url) FROM images WHERE image_id = c.hint_image) AS hint_image,type FROM card c WHERE c.card_id = $2 AND c.bu_id = $1`;
const cardDeleteByIdQuery = `delete from card where card_id =$1 returning card_id`;
const cardGetByDeckIdQuery = `select card_id,question,question_image,solution,option1,option2,option3,option4,option5,option1_image,option2_image,option3_image,option4_image,option5_image,hint,hint_image from card where deck_id=$1`
const cardDeleteByDeckIdQuery = `delete from card where deck_id=$1 and card_id=$2 returning deck_id`
const cardUpdateByIdQuery = `update card set question=$1,solution=$2,option1=$3,option2=$4,option3=$5,option4=$6,option5=$7,hint=$8,updated_at=$9,updated_by=$10,option1_image=$14,option2_image=$15,option3_image=$16,option4_image=$17,option5_image=$18 where card_id=$11 and deck_id=$12 and bu_id=$13 returning card_id`;
const cardVisibilityUpdateQuery = `update card set visibility=$4,updated_by=$5,updated_at=$6 where card_id=$3 AND deck_id=$2 AND bu_id=$1 returning card_id`
const getTrending = `SELECT d.deck_id AS "deckId", COUNT(*) FILTER (WHERE c.visibility = true) AS "cardCount", d.difficultylevel AS "difficultyLevel", d.name AS "deckName", COALESCE(i.image_url, di.image_url) AS "deckImage"
FROM deck d LEFT JOIN card c ON d.deck_id = c.deck_id LEFT JOIN images i ON i.image_id = d.image_id  LEFT JOIN default_images di ON d.default_image_id = di.image_id WHERE d.bu_id = $1 AND d.visibility = true AND d.created_at BETWEEN $2 AND $3 GROUP BY d.deck_id, d.difficultylevel, d.name, i.image_url, di.image_url ORDER BY d.deck_id DESC LIMIT $4;
`;
const finalCardCheckQuery = `select * from card where card_id=$1 and deck_id in(select deck_id from card group by deck_id having count(distinct card_id)<=1)`
const getCardByIdQuery = `select * from card where card_id=$1`
const deleteLearnerFavCardQuery = `delete from favourite_deck where card_id=$1`
const deleteLearnerRevCardQuery = `delete from revision_deck where card_id=$1`
const addFavourite = "insert into favourite_deck( user_id,card_id, bu_id) values($1,$2,$3) returning user_id"
const addRevise = "insert into revision_deck( user_id,card_id, bu_id) values($1,$2,$3) returning user_id"
const deleteFavourite = "DELETE FROM favourite_deck WHERE user_id=$1 AND card_id =$2 AND  bu_id =$3 returning card_id"
const deleteRevise = "DELETE FROM revision_deck WHERE user_id=$1 AND card_id =$2 AND  bu_id =$3 returning card_id"
const getCardByIdListQuery = `SELECT c.card_id,c.question,(SELECT image_url FROM images WHERE image_id = c.question_image) AS question_image,c.solution,c.option1,(SELECT image_url FROM images WHERE image_id = c.option1_image) AS option1_image,c.option2,(SELECT image_url FROM images WHERE image_id = c.option2_image) AS option2_image,c.option3,(SELECT image_url FROM images WHERE image_id = c.option3_image) AS option3_image,c.option4,(SELECT image_url FROM images WHERE image_id = c.option4_image) AS option4_image,c.option5,(SELECT image_url FROM images WHERE image_id = c.option5_image) AS option5_image,c.hint,(SELECT image_url FROM images WHERE image_id = c.hint_image) AS hint_image, c.type ,(SELECT count(card_id) from favourite_deck where card_id = c.card_id and user_id = $3) AS favourite FROM card c WHERE c.bu_id = $2 and c.deck_id=$1 and c.visibility=true`
const downloadExcel = `select file_link as "excelLink"  from exceldata`


//section
const getSectionByDeckIdQuery = `select * from section where $1=any(array[deck_id]);`
const getSectionDeleteDeckByIdQuery = `update section set deck_id=array_remove(deck_id,$1) where deck_id @>array[$1];`
const getSectionAndDeleteDeckByIdQuery = ` with check_exists as(select exists(select 1 from section where deck_id @>array[$1]) as id_exists),updated_data as(update section set deck_id=array_remove(deck_id,$1) where deck_id @>array[$1] returning *) select * from section where deck_id @> array[$1] union all select * from updated_data where(select id_exists from check_exists)=true;`
const getSectionDeckQuery = `select count(*) from section as s left join business as u on s.bu_id = u.bu_id where u.bu_id = $1`
const sectionDeckSearchQuery = `SELECT d.deck_id, d.name AS deck_name FROM section_deck_ref sd JOIN deck d ON sd.deck_id = d.deck_id WHERE sd.section_id = $1 AND (d.name ILIKE $2 OR d.subject ILIKE $2 OR d.topic ILIKE $2 OR d.sub_topic ILIKE $2)`
const getSectionDeckSearchQuery = `SELECT d.deck_id AS "deckId", d.name AS "deckName" FROM section_deck_ref sd JOIN deck d ON sd.deck_id = d.deck_id WHERE sd.section_id = $1   AND d.visibility = true AND (d.name ILIKE $2 OR d.subject ILIKE $2 OR d.topic ILIKE $2 OR d.sub_topic ILIKE $2) `
const getSections = `SELECT sectionId as "sectionId", sectionName as "sectionName", json_agg(json_build_object(
        'deckId', deck_id, 'deckName', name,'difficultyLevel', difficultylevel,
        'cardCount', COALESCE(card_count, 0),'deckImage', NULLIF(image_url, '')
    ) ) AS deck FROM( SELECT s.section_id AS sectionId,s.name AS sectionName,
        d.deck_id,d.name,d.difficultylevel,c.card_count,COALESCE(i.image_url, df.image_url) AS image_url,
        ROW_NUMBER() OVER (PARTITION BY s.section_id ORDER BY d.deck_id) AS row_num
    FROM section s JOIN section_deck_ref sd ON s.section_id = sd.section_id
        LEFT JOIN (SELECT deck_id, COUNT(*) AS card_count FROM card
            WHERE visibility = true GROUP BY deck_id) c ON sd.deck_id = c.deck_id
        LEFT JOIN deck d ON c.deck_id = d.deck_id LEFT JOIN images i ON d.image_id = i.image_id
        LEFT JOIN default_images df ON d.default_image_id = df.image_id
    WHERE s.bu_id = $1 AND s.visibility = true AND d.visibility = true
) AS subquery WHERE row_num <= 4 GROUP BY sectionId, sectionName `;
const getSectionDecks = `SELECT d.deck_id AS "deckId", d.name AS "deckName", d.difficultyLevel AS "difficultyLevel",COUNT(*) FILTER (WHERE c.visibility = true AND d.visibility = true) AS "cardCount",
    COALESCE(i.image_url, di.image_url) AS "deckImage" FROM deck AS d  JOIN section_deck_ref AS sdr ON d.deck_id = sdr.deck_id JOIN section AS s ON sdr.section_id = s.section_id LEFT JOIN     card AS c ON d.deck_id = c.deck_id LEFT JOIN images AS i ON d.image_id = i.image_id LEFT JOIN    default_images AS di ON d.default_image_id = di.image_id WHERE    s.section_id = $1    AND d.visibility = true GROUP BY d.deck_id,    d.name,    d.difficultyLevel,    i.image_url, di.image_url;
`;
const toggleSection = `UPDATE section SET visibility = $1 WHERE section_id = $2 returning section_id`

//section
const sectionAddQuery = `insert into section(bu_id,name,created_by,created_at,visibility) values($1,$2,$3,$4,$5) returning section_id`
const addSectiondeckref = `insert into section_deck_ref(section_id,deck_id) values ($1,$2) returning section_id`
const removeSectiondeckref = `delete from section_deck_ref where deck_id=$2 and section_id in (select section_id from section_deck_ref where section_id=$1 group by section_id having count(*) >1) returning deck_id`
const sectionUpdateQuery = `update section set name=$3,updated_at=$4,updated_by=$5 where section_id=$2 and bu_id = $1 returning section_id`
const sectionGetAllQuery = `SELECT s.section_id, s.name AS section_name, COUNT(sd.deck_id) AS deck_count FROM section AS s LEFT JOIN section_deck_ref AS sd ON s.section_id = sd.section_id WHERE s.bu_id = $1 GROUP BY s.section_id, s.name`
const sectionGetByIdQuery = `SELECT s.section_id, s.name AS section_name,s.visibility, d.deck_id, d.name AS deck_name, d.card_count, d.difficultylevel,(select image_url from images where image_id = d.image_id) as deckimage, COUNT(sd.deck_id) AS deck_count FROM section AS s LEFT JOIN section_deck_ref AS sd ON s.section_id = sd.section_id LEFT JOIN deck AS d ON sd.deck_id = d.deck_id WHERE s.section_id = $1 and s.bu_id = $2 GROUP BY s.section_id, s.name, d.deck_id, d.name, d.card_count`
const sectionDeleteByIdQuery = `delete from section where section_id=$1 AND bu_id=$2 returning section_id`;
const sectionDeckRefDeleteBySectionIdQuery = `delete from section_deck_ref where section_id=$1 returning section_id`;

//revisionDeck

const revisionDataDeleteByCardIdQuery = `delete from revision_deck where card_id =$1`;
const revisionDataDeleteByCardQuery = `delete from revision_deck where card_id =$1 returning card_id`;
const getReviseDataByCardIdQuery = `select * from revision_deck where card_id=$1`;
const favouriteDeckDataDeleteByCardIdQuery = `delete from favourite_deck where card_id =$1`
const favouriteDataDeleteByCardQuery = `delete from favourite_deck where card_id =$1 returning card_id`;


//image
const deleteImageUrlQuery = `delete from images where image_id = $1`
const getImageQuery = `select image_url from images where image_id=$1`
const getImageIdQuery = `select image_id from images where image_url=$1`
const imageDeleteQuery = `delete from images where image_id=$1 returning image_url`;
const ImageAddQuery = `insert into images(image_url) values($1) returning image_id,image_url`;
const deleteImageUrlByIdQuery = `delete from images where image_id=ANY ($1::integer[]) returning image_url`

//loginService
const checkIdAndKey = 'select bu_id, primary_dark_color,primary_light_color,secondary_dark_color,secondary_light_color from business where bu_id=$1 AND secret_key=$2'
const checkUserAndEmail = "select user_id,user_status from user_management where  email=$1 AND role=$2 AND bu_id=$3"
const addUser = "INSERT INTO user_management (user_name, email ,role,  bu_id, user_status,created_at) VALUES ($1, $2, $3, $4,$5,$6) returning user_id"
const addClient = "INSERT INTO business(secret_key, display_name ,primary_dark_color, primary_light_color ,secondary_light_color ,secondary_dark_color , bu_name , created_at, user_status) values($1, $2, $3, $4,$5,$6,$7,$8) returning bu_id"


//user
const addUserResult = "INSERT INTO result(deck_id,score,correct_answer,using_hint,without_using_hint,incorrect_answer,un_answered,result_date,user_id,bu_id) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning id"
const getUserResult = `SELECT d.deck_id AS "deckId",COUNT(*) FILTER (WHERE c.visibility = true AND d.visibility = true) AS "cardCount",
d.subject,d.topic,d.exam,d.standard,d.sub_topic AS "subTopic",d.name AS "deckName", d.difficultylevel AS "difficultyLevel", COALESCE(i.image_url, di.image_url) AS "imageUrl" FROM deck d LEFT JOIN images i ON d.image_id = i.image_id LEFT JOIN default_images di ON d.default_image_id = di.image_id LEFT JOIN card c ON d.deck_id = c.deck_id WHERE d.deck_id = $2 AND d.bu_id = $1 GROUP BY d.deck_id, d.subject,d.topic,d.sub_topic,d.name,d.difficultylevel,i.image_url,di.image_url;
`
const getResult = `select  MAX(score) AS "score" from result where  deck_id = $3 AND bu_id = $2 AND user_id=$1`
const getFavoriteCards = `SELECT c.card_id AS "cardId",
c.deck_id AS "deckId", c.question, c.type, CASE WHEN c.option1 IS NULL THEN NULL ELSE c.option1 END,CASE WHEN c.option2 IS NULL THEN NULL ELSE c.option2 END, CASE WHEN c.option3 IS NULL THEN NULL ELSE c.option3 END,
CASE WHEN c.option4 IS NULL THEN NULL ELSE c.option4 END,CASE WHEN c.option5 IS NULL THEN NULL ELSE c.option5 END,
i1.image_url AS "questionImage", c.solution, i2.image_url AS option1_image, i3.image_url AS option2_image, i4.image_url AS option3_image, i5.image_url AS option4_image, i6.image_url AS option5_image, c.hint AS "hintText", i7.image_url AS "hintImage", c.visibility, true AS favourite
FROM card c LEFT JOIN images i1 ON c.question_image = i1.image_id LEFT JOIN images i2 ON c.option1_image = i2.image_id
LEFT JOIN images i3 ON c.option2_image = i3.image_id LEFT JOIN images i4 ON c.option3_image = i4.image_id
LEFT JOIN images i5 ON c.option4_image = i5.image_id LEFT JOIN images i6 ON c.option5_image = i6.image_id
LEFT JOIN images i7 ON c.hint_image = i7.image_id JOIN favourite_deck fd ON c.card_id = fd.card_id
JOIN deck d ON c.deck_id = d.deck_id WHERE fd.user_id = $1 AND c.visibility = true AND d.visibility = true  AND fd.bu_id = $2 ORDER BY RANDOM();

`
const getReviseCards = `SELECT  c.card_id AS "cardId",
c.deck_id AS "deckId",  c.question, c.type,
CASE WHEN c.option1 IS NULL THEN NULL ELSE c.option1 END,
CASE WHEN c.option2 IS NULL THEN NULL ELSE c.option2 END,
CASE WHEN c.option3 IS NULL THEN NULL ELSE c.option3 END,
CASE WHEN c.option4 IS NULL THEN NULL ELSE c.option4 END,
CASE WHEN c.option5 IS NULL THEN NULL ELSE c.option5 END,
i1.image_url AS "questionImage",c.solution,
i2.image_url AS option1_image, i3.image_url AS option2_image,
i4.image_url AS option3_image, i5.image_url AS option4_image,
i6.image_url AS option5_image, c.hint AS "hintText",
i7.image_url AS "hintImage", c.visibility,
CASE WHEN EXISTS (SELECT 1 FROM favourite_deck  WHERE user_id = $1
    AND card_id = c.card_id     AND bu_id = $2 ) THEN true ELSE false END AS favourite FROM card c
LEFT JOIN images i1 ON c.question_image = i1.image_id
LEFT JOIN images i2 ON c.option1_image = i2.image_id
LEFT JOIN images i3 ON c.option2_image = i3.image_id
LEFT JOIN images i4 ON c.option3_image = i4.image_id
LEFT JOIN images i5 ON c.option4_image = i5.image_id
LEFT JOIN images i6 ON c.option5_image = i6.image_id
LEFT JOIN images i7 ON c.hint_image = i7.image_id
JOIN revision_deck fd ON c.card_id = fd.card_id
JOIN deck d ON c.deck_id = d.deck_id WHERE fd.user_id = $1 AND c.visibility = true
AND fd.bu_id = $2 AND d.visibility = true ORDER BY RANDOM()
`


//result

const deleteByDeckIdQuery = `delete from result where deck_id =$1`;


module.exports = {
    getRandomImage,
    downloadExcel,
    searchQueryForGetDeckName,
    editeGetAlldecks,
    deckAddQuery,
    cardCountGetByDeckIdQuery,
    getCardByDeckIdQuery,
    searchDeckByNameQuery,
    getAllDeckByNameQuery,
    checkDeckIdExistQuery,
    removeSectionRefByIdQuery,
    deleteImageUrlByIdQuery,
    cardAddQuery, deckGetAllQuery, updateDeckVisibilityByIdQuery, updateDeckCoverImageQuery,
    deckCoverImageDeleteQuery,
    deckGetByIdQuery, deckandCardGetByIdQuery, deckDeleteByIdQuery,
    deckSearchQuery, cardGetAllQuery, cardGetByIdQuery, cardGetByDeckIdQuery,
    cardDeleteByIdQuery, cardDeleteByDeckIdQuery, getSectionByDeckIdQuery,
    getSectionAndDeleteDeckByIdQuery, getSectionDeleteDeckByIdQuery, sectionAddQuery, sectionUpdateQuery, sectionGetAllQuery,
    sectionGetByIdQuery,
    sectionDeleteByIdQuery,
    deckUpdateQuery,
    cardCountUpdateQuery, sectionDeckRefDeleteBySectionIdQuery,
    cardUpdateByIdQuery, addSectiondeckref, removeSectiondeckref, getSectionDeckQuery, cardVisibilityUpdateQuery, sectionDeckSearchQuery,
    revisionDataDeleteByCardIdQuery,
    revisionDataDeleteByCardQuery,
    getReviseDataByCardIdQuery,
    favouriteDeckDataDeleteByCardIdQuery,
    favouriteDataDeleteByCardQuery,
    ImageAddQuery,
    deckCoverImageDelete,
    finalCardCheckQuery,
    getCardByIdQuery,
    deleteLearnerFavCardQuery,
    deleteLearnerRevCardQuery,
    getSectionDecks,
    getCardByIdListQuery,
    deleteImageUrlQuery,
    getImageQuery,
    getImageIdQuery,
    updateCardCount,
    imageDeleteQuery,
    getSectionDeckSearchQuery,


    //deck 
    getMyDeck,
    getFavorite,
    getTrending,
    getSections,
    addFavourite,
    addRevise,
    deleteRevise,
    deleteFavourite,
    trendingSearchDeckByNameQuery,
    //login service
    checkIdAndKey,
    checkUserAndEmail,
    addUser,
    addClient,


    //user
    addUserResult,
    getUserResult,
    getFavoriteCards,
    getReviseCards,
    getResult,

    //result
    deleteByDeckIdQuery,
    toggleSection
}

