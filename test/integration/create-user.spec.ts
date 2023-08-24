import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

describe('test POST /users', () => {
  let prisma: PrismaClient;
  let app: INestApplication;
  let container: StartedPostgreSqlContainer;

  afterAll(async () => {
    await container.stop();
  });

  beforeAll(async () => {
    // iniciando o container docker
    container = await new PostgreSqlContainer().start();

    // configurando a URL de conexão do prisma
    const urlConnection = `postgresql://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/${container.getDatabase()}?schema=public`;

    // definir a URL de conexão para conexãp do prisma
    process.env.DATABASE_URL = urlConnection;

    // criar as tabelas definidas no prisma no banco de dados
    execSync('npx prisma db push', {
      env: {
        ...process.env,
        DATABASE_URL: urlConnection,
      },
    });

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: urlConnection,
        },
      },
    });

    await app.init();
  });

  it('deve criar um novo usuário', async () => {
    // Act
    const response = await request(await app.getHttpServer())
      .post('/users')
      .send({
        email: 'test@mail.com',
        name: 'John Doe',
      });

    // Assert
    const userDb = await prisma.users.findFirst();
    expect(response.statusCode).toBe(201);
    expect(userDb.email).toBe('test@mail.com');
    expect(userDb.name).toBe('John Doe');
  });

  it('deve lançar um erro porque já existe um usuário com esse email', async () => {
    // Act
    const response = await request(await app.getHttpServer())
      .post('/users')
      .send({
        email: 'test@mail.com',
        name: 'John Doe',
      });

    // Assert
    expect(response.statusCode).toBe(422);
  });

  it('deve lançar um erro porque não foi enviado os dados para criação do usuário', async () => {
    // Act
    const response = await request(await app.getHttpServer()).post('/users');

    // Assert
    expect(response.statusCode).toBe(400);
  });
});
