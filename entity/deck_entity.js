class Deck {
    constructor(deckId, buId, cardId, deckName,deckImageId, difficultyLevel, subject, topic, subTopic, exam, standard, visibility, deckImage, fileLink, createdAt, updatedAt, createdBy, updatedBy,cardCount,cards) {
        this.deckId = deckId
        this.buId = buId
        this.cardId = cardId
        this.deckName = deckName
        this.difficultyLevel = difficultyLevel
        this.subject = subject
        this.topic = topic
        this.subTopic = subTopic
        this.exam = exam
        this.standard = standard
        this.visibility = visibility
        this.deckImage = deckImage
        this.deckImageId=deckImageId
        this.fileLink = fileLink
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.createdBy = createdBy
        this.updatedBy = updatedBy
        this.cardCount=cardCount
        this.cards=cards
    }
}

module.exports = { Deck }