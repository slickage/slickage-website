import { getS3ImageUrl } from '../../src/lib/utils'

// Mock fetch
global.fetch = jest.fn()

describe('getS3ImageUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns fallback URL when path is empty', async () => {
    const result = await getS3ImageUrl('')
    expect(result).toBe('/placeholder.svg')
  })

  it('returns fallback URL when path is placeholder', async () => {
    const result = await getS3ImageUrl('/placeholder.svg')
    expect(result).toBe('/placeholder.svg')
  })

  it('returns custom fallback URL when provided', async () => {
    const result = await getS3ImageUrl('', '/custom-fallback.jpg')
    expect(result).toBe('/custom-fallback.jpg')
  })

  it('handles successful API response', async () => {
    const mockResponse = { url: 'https://s3.amazonaws.com/bucket/image.jpg' }
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const result = await getS3ImageUrl('test-image.jpg')
    expect(result).toBe('https://s3.amazonaws.com/bucket/image.jpg')
    expect(fetch).toHaveBeenCalledWith('/api/s3-url?key=test-image.jpg')
  })

  it('handles API error response', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    const result = await getS3ImageUrl('test-image.jpg')
    expect(result).toBe('/placeholder.svg')
  })

  it('handles network error', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const result = await getS3ImageUrl('test-image.jpg')
    expect(result).toBe('/placeholder.svg')
  })

  it('normalizes path with leading slash', async () => {
    const mockResponse = { url: 'https://s3.amazonaws.com/bucket/image.jpg' }
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    await getS3ImageUrl('/test-image.jpg')
    expect(fetch).toHaveBeenCalledWith('/api/s3-url?key=test-image.jpg')
  })

  it('handles complex paths', async () => {
    const mockResponse = { url: 'https://s3.amazonaws.com/bucket/folder/image.jpg' }
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const result = await getS3ImageUrl('folder/subfolder/image.jpg')
    expect(result).toBe('https://s3.amazonaws.com/bucket/folder/image.jpg')
    expect(fetch).toHaveBeenCalledWith('/api/s3-url?key=folder%2Fsubfolder%2Fimage.jpg')
  })
}) 