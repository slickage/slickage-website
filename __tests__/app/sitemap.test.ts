import { sitemap } from '../../src/app/sitemap'

describe('Sitemap', () => {
  it('generates sitemap with correct structure', () => {
    const result = sitemap()
    
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('includes home page', () => {
    const result = sitemap()
    
    const homePage = result.find(page => page.url === 'https://beta.slickage.io')
    expect(homePage).toBeDefined()
    expect(homePage?.priority).toBe(1)
    expect(homePage?.changeFrequency).toBe('monthly')
  })

  it('includes case studies page', () => {
    const result = sitemap()
    
    const caseStudiesPage = result.find(page => page.url === 'https://beta.slickage.io/case-studies')
    expect(caseStudiesPage).toBeDefined()
    expect(caseStudiesPage?.priority).toBe(0.9)
    expect(caseStudiesPage?.changeFrequency).toBe('weekly')
  })

  it('includes contact page', () => {
    const result = sitemap()
    
    const contactPage = result.find(page => page.url === 'https://beta.slickage.io/contact')
    expect(contactPage).toBeDefined()
    expect(contactPage?.priority).toBe(0.6)
    expect(contactPage?.changeFrequency).toBe('monthly')
  })

  it('excludes hidden routes', () => {
    const result = sitemap()
    
    const aboutPage = result.find(page => page.url.includes('/about'))
    const projectsPage = result.find(page => page.url.includes('/projects'))
    const servicesPage = result.find(page => page.url.includes('/services'))
    
    expect(aboutPage).toBeUndefined()
    expect(projectsPage).toBeUndefined()
    expect(servicesPage).toBeUndefined()
  })

  it('has valid lastModified dates', () => {
    const result = sitemap()
    
    result.forEach(page => {
      expect(page.lastModified).toBeInstanceOf(Date)
      expect(page.lastModified.getTime()).toBeLessThanOrEqual(Date.now())
    })
  })

  it('has valid priorities', () => {
    const result = sitemap()
    
    result.forEach(page => {
      expect(page.priority).toBeGreaterThanOrEqual(0)
      expect(page.priority).toBeLessThanOrEqual(1)
    })
  })

  it('has valid change frequencies', () => {
    const result = sitemap()
    const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
    
    result.forEach(page => {
      expect(validFrequencies).toContain(page.changeFrequency)
    })
  })
}) 