import { getAllCaseStudies, getCaseStudyById } from '../../src/data/case-studies'

describe('Case Studies Data', () => {
  describe('getAllCaseStudies', () => {
    it('returns all case studies', () => {
      const caseStudies = getAllCaseStudies()
      
      expect(Array.isArray(caseStudies)).toBe(true)
      expect(caseStudies.length).toBeGreaterThan(0)
    })

    it('returns case studies with required properties', () => {
      const caseStudies = getAllCaseStudies()
      
      caseStudies.forEach(caseStudy => {
        expect(caseStudy).toHaveProperty('id')
        expect(caseStudy).toHaveProperty('title')
        expect(caseStudy).toHaveProperty('subtitle')
        expect(caseStudy).toHaveProperty('heroImage')
        expect(caseStudy).toHaveProperty('overview')
        expect(caseStudy).toHaveProperty('tags')
        expect(caseStudy).toHaveProperty('content')
      })
    })

    it('returns case studies with valid content structure', () => {
      const caseStudies = getAllCaseStudies()
      
      caseStudies.forEach(caseStudy => {
        expect(Array.isArray(caseStudy.tags)).toBe(true)
        expect(Array.isArray(caseStudy.content)).toBe(true)
        expect(caseStudy.content.length).toBeGreaterThan(0)
      })
    })
  })

  describe('getCaseStudyById', () => {
    it('returns case study by valid ID', async () => {
      const caseStudies = getAllCaseStudies()
      const firstCaseStudy = caseStudies[0]
      
      const result = await getCaseStudyById(firstCaseStudy.id)
      
      expect(result).toBeDefined()
      expect(result?.id).toBe(firstCaseStudy.id)
      expect(result?.title).toBe(firstCaseStudy.title)
    })

    it('returns null for invalid ID', async () => {
      const result = await getCaseStudyById('invalid-id')
      
      expect(result).toBeNull()
    })

    it('returns null for non-existent ID', async () => {
      const result = await getCaseStudyById('non-existent')
      
      expect(result).toBeNull()
    })

    it('returns case study with all required properties', async () => {
      const caseStudies = getAllCaseStudies()
      const firstCaseStudy = caseStudies[0]
      
      const result = await getCaseStudyById(firstCaseStudy.id)
      
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('title')
      expect(result).toHaveProperty('subtitle')
      expect(result).toHaveProperty('heroImage')
      expect(result).toHaveProperty('overview')
      expect(result).toHaveProperty('tags')
      expect(result).toHaveProperty('content')
      expect(result).toHaveProperty('quickFacts')
    })
  })
}) 