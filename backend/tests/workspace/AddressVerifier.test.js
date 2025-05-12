// Exemple de test : journeyService.test.js
const { isAddressCorrect } = require('../../components/workspace/GeneralError/adressVerifier')

describe('Address Verifier', () => {
    beforeEach(() => {
        global.fetch = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('Should return no error', async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => ({
            result: {
                verdict: {
                    inputGranularity: "PREMISE",
                    validationGranularity: "PREMISE"
                }
            }
            })
        })

        const result = await isAddressCorrect(["123 Rue Principale"], "QC", "Montréal")
        expect(result.hasError).toBe(false)
    })

    it('Should return an error', async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => ({
            result: {
                verdict: {
                    inputGranularity: "BLOCK",
                    validationGranularity: "STREET"
                }
            }
            })
        })

        const result = await isAddressCorrect(["Quelque part"], "QC", "Ville inconnue")
        expect(result.hasError).toBe(true)
        expect(result.error).toBeDefined()
        expect(result.error.errors).toBeDefined()
        expect(result.error.errors.journey).toEqual({"code": "bad-request","name": "L'adresse renseignée est invalide ou est trop imprécise."})
    })
})