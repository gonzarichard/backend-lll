import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "AdoptMe API",
    version: "1.0.0",
    description: "Documentación de la API AdoptMe - Módulo Users",
  },
  servers: [
    {
      url: "http://localhost:8080",
      description: "Servidor local",
    },
  ],
  tags: [
    {
      name: "Users",
      description: "Operaciones relacionadas con usuarios",
    },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            example: "64f123456789abcdef123456",
          },
          first_name: {
            type: "string",
            example: "Gonzalo",
          },
          last_name: {
            type: "string",
            example: "Richard",
          },
          email: {
            type: "string",
            format: "email",
            example: "gonzalo@email.com",
          },
          password: {
            type: "string",
            example: "********",
          },
          role: {
            type: "string",
            example: "user",
          },
          pets: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
      UserUpdate: {
        type: "object",
        properties: {
          first_name: {
            type: "string",
            example: "Gonzalo",
          },
          last_name: {
            type: "string",
            example: "Richard",
          },
          email: {
            type: "string",
            format: "email",
            example: "gonzalo@email.com",
          },
          role: {
            type: "string",
            example: "user",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "error",
          },
          error: {
            type: "string",
            example: "User not found",
          },
        },
      },
    },
  },
  paths: {
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Obtener todos los usuarios",
        responses: {
          200: {
            description: "Usuarios obtenidos correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success",
                    },
                    payload: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/User",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    "/api/users/{uid}": {
      get: {
        tags: ["Users"],
        summary: "Obtener un usuario por ID",
        parameters: [
          {
            name: "uid",
            in: "path",
            required: true,
            description: "ID del usuario",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Usuario encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success",
                    },
                    payload: {
                      $ref: "#/components/schemas/User",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Usuario no encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },

      put: {
        tags: ["Users"],
        summary: "Actualizar un usuario",
        parameters: [
          {
            name: "uid",
            in: "path",
            required: true,
            description: "ID del usuario",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserUpdate",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Usuario actualizado correctamente",
          },
          404: {
            description: "Usuario no encontrado",
          },
        },
      },

      delete: {
        tags: ["Users"],
        summary: "Eliminar un usuario",
        parameters: [
          {
            name: "uid",
            in: "path",
            required: true,
            description: "ID del usuario",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Usuario eliminado correctamente",
          },
          404: {
            description: "Usuario no encontrado",
          },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
