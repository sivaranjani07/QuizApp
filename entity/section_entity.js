class Section {
    constructor(sectionId, buId, deckId, sectionName, createdAt, updatedAt, createdBy, updatedBy, deckCount,deck) {
        this.sectionId = sectionId
        this.buId = buId
        this.deckId = deckId
        this.sectionName = sectionName
        this.createdAt = createdAt
        this.createdBy = createdBy
        this.updatedAt = updatedAt
        this.updatedBy = updatedBy
        this.deckCount = deckCount
        this.deck = deck
    }
}
module.exports = { Section }