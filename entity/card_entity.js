class Card {
    constructor(cardId, buId, question, questionImage, hint, hintImage, solution, option1, option2, option3, option4, option5, option1_image, option2_image, option3_image, option4_image, option5_image, visibility, createdAt, updatedAt, createdBy, updatedBy,favourite,type) {
        //commented temp need to verify
    // constructor(cardId, buId, question, questionImage, hint, hintImage, solution, options, option2, option3, option4, option5, optionImage1, optionImage2, optionImage3, optionImage4, optionImage5, visibility, createdAt, updatedAt, createdBy, updatedBy) {
        this.cardId = cardId
        this.buId = buId
        this.question = question
        this.questionImage = questionImage
        this.hint = hint
        this.hintImage = hintImage
        this.solution = solution
        this.option1 = option1
        this.option2 = option2
        this.option3 = option3
        this.option4 = option4
        this.option5 = option5
        this.questionType=type
        // this.optionImage1 = option1_image
        // this.optionImage2 = option2_image
        // this.optionImage3 = option3_image
        // this.optionImage4 = option4_image
        // this.optionImage5 = option5_image
        this.visibility = visibility
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.createdBy = createdBy
        this.updatedBy = updatedBy
        this.favourite = favourite
    }
}

module.exports = { Card }