// Exemple de test : journeyService.test.js
const { getCorrectAddress } = require('../../components/workspace/GoogleAPI/adressVerifier')

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
                    },
                    address: {
                        formattedAddress: '999 Boulevard Talbot, Chicoutimi, QC G7H 4B5, Canada'
                    }
                }
            })
        })

        const result = await getCorrectAddress(["123 Rue Principale"], "Montréal")
        expect(result).toBe("999 Boulevard Talbot, Chicoutimi, QC G7H 4B5, Canada")
    })

    it('Should return null', async () => {
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

        const result = await getCorrectAddress(["Quelque part"], "Ville inconnue")
        expect(result).toBe(null)
    })
})