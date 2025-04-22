const GeneralErrorManager = require("../../components/workspace/GeneralError/GeneralErrorManager")

describe('General Error Manager', () => {

    it("should return true", () => {
        const validId = "68016fe1649217f80d00cbdc"

        expect(GeneralErrorManager.isValidId(validId)).toBe(true);
    })

    it ("should return false", () => {
        const id1 = "68016fe16492%7f80d00cbdc"
        const id2 = "68016fe16#4927f80d00cbdc"
        const id3 = "68016fe16$4927f80d00cbdc"

        expect(GeneralErrorManager.isValidId(id1)).toBe(false);
        expect(GeneralErrorManager.isValidId(id2)).toBe(false);
        expect(GeneralErrorManager.isValidId(id3)).toBe(false);
    })
})