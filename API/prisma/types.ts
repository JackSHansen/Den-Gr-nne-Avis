export const fieldTypes: Record<string, Record<string, 'string' | 'number' | 'boolean'>> = {
  user: {
    id: 'number',
    firstname: 'string',
    lastname: 'string',
    address: 'string',
    zipcode: 'number',
    city: 'string',
    email: 'string',
    password: 'string',
    hasNewsletter: 'boolean',
    hasNotification: 'boolean',
    refreshToken: 'string',
    isActive: 'boolean'
  },
  category: {
    id: 'number',
    name: 'string',
    slug: 'string'
  },
  comment: {
    id: 'number',
    comment: 'string',
    userId: 'number',
    productId: 'number'
  },
  product: {
    id: 'number',
    name: 'string',
    image: 'string',
    description: 'string',
    price: 'number',
    slug: 'string',
    categoryId: 'number',
    userId: 'number'
  }
};