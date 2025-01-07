import { createSwaggerSpec } from 'next-swagger-doc'
import { OpenAPIV3 } from 'openapi-types'

export const getApiDocs = async (): Promise<OpenAPIV3.Document> => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', // define api folder under app folder
    definition: {
      openapi: '3.0.0',
      info: {
        title: '김재훈 포트폴리오 Next Swagger API',
        version: '1.0',
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [],
    },
  }) as OpenAPIV3.Document
  return spec
}
