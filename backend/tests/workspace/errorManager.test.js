const GeneralErrorManager = require("../../components/workspace/GeneralError/GeneralErrorManager")

describe('General Error Manager', () => {

    it("should return false", () => {
        const validId = "68016fe1649217f80d00cbdc"

        expect(GeneralErrorManager.isValidId(validId).hasError).toBe(false);
    })

    it ("should return true", () => {
        const id1 = "68016fe16492%7f80d00cbdc"
        const id2 = "68016fe16#4927f80d00cbdc"
        const id3 = "68016fe16$4927f80d00cbdc"

        expect(GeneralErrorManager.isValidId(id1, "user").hasError).toBe(true);
        expect(GeneralErrorManager.isValidId(id2, "user").hasError).toBe(true);
        expect(GeneralErrorManager.isValidId(id3, "user").hasError).toBe(true);
    })

    it("should return right error name", () => {
        const id1 = "68016fe16492%7f80d00cbdc" // bad ID
    
        const carResult = GeneralErrorManager.isValidId(id1, "car").error;
        const journeyResult = GeneralErrorManager.isValidId(id1, "journey").error;
        const userResult = GeneralErrorManager.isValidId(id1, "user").error;
        
        expect(carResult).toEqual({
            errors: {
                car: {
                    code: "bad-request",
                    name: "L'identifiant renseigné n'est pas dans un format acceptable."
                }
            }
        });
    
        expect(journeyResult).toEqual({
            errors: {
                journey: {
                    code: "bad-request",
                    name: "L'identifiant renseigné n'est pas dans un format acceptable."
                }
            }
        });
    
        expect(userResult).toEqual({
            errors: {
                user: {
                    code: "bad-request",
                    name: "L'identifiant renseigné n'est pas dans un format acceptable."
                }
            }
        });
    });    
})