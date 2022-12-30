import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Podcast } from 'src/farmAidService/entities/podcasts.entity';
import { Episode } from 'src/farmAidService/entities/episode.entity';

interface Input {
  [key: string]: Object;
}

interface Query {
  query: string;
  varialbles?: Object;
}

const GRAPHQL_ENDPOINT = '/graphql';
const testUser = {
  email: 'jang@jang.ok',
  password: '12345',
};

jest.setTimeout(40000);

describe('PodcastsModule (e2e)', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let podcastsRepository: Repository<Podcast>;
  let episodeRepository: Repository<Episode>;
  let jwtToken: string;
  let jwtToken2: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    podcastsRepository = module.get<Repository<Podcast>>(
      getRepositoryToken(Podcast),
    );
    episodeRepository = module.get<Repository<Episode>>(
      getRepositoryToken(Episode),
    );
    await app.init();
  });

  afterAll(async () => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'farmAidService-test',
    });
    const connection = await dataSource.initialize();
    await connection.dropDatabase();
    await connection.destroy();
    await app.close();
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve({});
      }, 25000);
    });
  });

  describe('createAccount', () => {
    const EMAIL = 'jang@jang.ok';
    it('should create account ', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `mutation{
          createAccount(input:{
            email:"${testUser.email}",
            password:"${testUser.password}",
            role:Host
          }){
            ok
            error
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          //   console.log(res.body);
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });

    it('should create account2 ', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `mutation{
          createAccount(input:{
            email:"jachky@jang.ok",
            password:"12345",
            role:Host
          }){
            ok
            error
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          //   console.log(res.body);
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });

    it('should fail if account already exists', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `mutation {
          createAccount(input:{
            email:"${testUser.email}",
            password:"${testUser.password}",
            role:Host
          }) {
            ok
            error
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toBe(
            'There is a user with that email already',
          );
          expect(res.body.data.createAccount.error).toEqual(expect.any(String));
        });
    });
  });

  describe('login', () => {
    it('should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        mutation {
          login(input:{
            email: "${testUser.email}",
            password:"${testUser.password}",
          }){
            ok
            error
            token
          }
        }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          // console.log(login);
          expect(login.ok).toBe(true);
          expect(login.error).toEqual(null);
          expect(login.token).toEqual(expect.any(String));
          jwtToken = login.token;
        });
    });

    it('should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        mutation {
          login(input:{
            email:"jachky@jang.ok",
            password:"12345",
          }){
            ok
            error
            token
          }
        }
        `,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          // console.log(login);
          expect(login.ok).toBe(true);
          expect(login.error).toEqual(null);
          expect(login.token).toEqual(expect.any(String));
          jwtToken2 = login.token;
        });
    });

    it('should not be able to login with wrong credentials', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
        mutation {
          login(input:{
            email:"${testUser.email}",
            password:"xxx",
          }){
            ok
            error
            token
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          //   console.log(login);
          expect(login.ok).toBe(false);
          expect(login.error).toBe('Wrong password');
          expect(login.token).toBe(null);
        });
    });
  });

  describe('createPodcast', () => {
    let createPodcastInput = {
      title: 'New world',
      categoryName: 'Issue',
      rating: 3,
    };

    it('should create podcast and category if podcast and category does not exist', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
          mutation {
            createPodcast(input:{
                title:"${createPodcastInput.title}",
                categoryName:"${createPodcastInput.categoryName}",
                rating:${createPodcastInput.rating}
            }){
                ok
                error
            }
        }`,
        })
        .expect(200)
        .expect((res) => {
          const { ok, error } = res.body.data.createPodcast;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
  });

  describe('editPodcast', () => {
    let podcastId: number;
    beforeAll(async () => {
      const [podcast] = await podcastsRepository.find();
      podcastId = podcast.id;
    });
    const newTitle = "I'll be back";

    it('should edit podcast', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
            mutation { 
                editPodcast (
                   input:{
                    title:"${newTitle}"
                    podcastId:${podcastId}
                   }
                ){
                    ok
                    error
                }
            }
            `,
        })
        .expect(200)
        .expect((res) => {
          //   console.log(res.body.data);
          const { ok, error } = res.body.data.editPodcast;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });

    it('should not edit if podcast not exist', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
                mutation {
                    editPodcast(input:{
                        podcastId:34
                        title:"ArabiaNight"
                        categoryName:"Action"
                        rating:1
                      }){
                        ok
                        error
                      }
                }
            `,
        })
        .expect(200)
        .expect((res) => {
          //   console.log(res.body.data);
          // console.log(jwtToken);
          const { ok, error } = res.body.data.editPodcast;
          expect(ok).toBe(false);
          expect(error).toBe('Podcast not found');
        });
    });

    it('should not edit podcast if not your podcast', () => {
      return (
        request(app.getHttpServer())
          .post(GRAPHQL_ENDPOINT)
          .set('X-JWT', jwtToken2)
          .send({
            query: `
              mutation { 
                  editPodcast (
                     input:{
                      title:"${newTitle}"
                      podcastId:${podcastId}
                     }
                  ){
                      ok
                      error
                  }
              }
              `,
          })
          // .expect(200)
          .expect((res) => {
            // console.log(res.body.data);
            // console.log(jwtToken2);
            const { ok, error } = res.body.data.editPodcast;
            expect(ok).toBe(false);
            expect(error).toBe("You can't edit a podcast that you don't host");
          })
      );
    });
  });

  describe('deletePodcast', () => {
    let podcastId: number;
    beforeAll(async () => {
      const [podcast] = await podcastsRepository.find();
      podcastId = podcast.id;
    });

    it('should delete podcast', () => {
      request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
                mutation {
                    deletePodcast(input:${podcastId}){
                        ok
                        error
                    }
                }
            `,
        })
        .expect(200)
        .expect((res) => {});
    });

    it('should not delete if podcast not exist', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
          mutation {
            deletePodcast (input:{podcastId:19}){
              ok
              error
            }
          }
          `,
        })
        .expect(200)
        .expect((res) => {});
    });

    it('should delete podcast if not yours', () => {
      request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
                  mutation {
                      deletePodcast(input:${podcastId}){
                          ok
                          error
                      }
                  }
              `,
        })
        .expect(200)
        .expect((res) => {});
    });
  });

  describe('createEpisode', () => {
    let podcastId: number;
    const epTitle = 'Whe we disco';
    const description = 'End of world';
    beforeAll(async () => {
      const [podcast] = await podcastsRepository.find();
      podcastId = podcast.id;
    });

    it('should create episode', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
                mutation {
                    createEpisode(input:{
                        epTitle:"${epTitle}",
                        description:"${description}",
                        podcastId:${podcastId}
                    }){
                        ok
                        error
                    }
                }
            `,
        })
        .expect(200)
        .expect((res) => {
          //   console.log(res.body.data);
          const { ok, error } = res.body.data.createEpisode;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });

    it('should not create episode if podcast not exist', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
                  mutation {
                      createEpisode(input:{
                          epTitle:"${epTitle}",
                          description:"${description}",
                          podcastId:${podcastId}
                      }){
                          ok
                          error
                      }
                  }
              `,
        })
        .expect(200)
        .expect((res) => {});
    });

    it('should not create if not your podcast', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken2)
        .send({
          query: `
            mutation {
                createEpisode(input:{
                    epTitle:"${epTitle}",
                    description:"${description}",
                    podcastId:${podcastId}
                }){
                    ok
                    error
                }
            }
            `,
        })
        .expect(200)
        .expect((res) => {});
    });
  });

  describe('editEpisode', () => {
    let episodeId: number;
    const newEpTitle = 'groove';
    const newDescription = 'reboot of world';
    beforeAll(async () => {
      const [episode] = await episodeRepository.find();
      episodeId = episode.id;
    });

    it('should edit eposode', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
                mutation {
                    editEpisode(
                        input: {
                            id: ${episodeId},
                            epTitle:"${newEpTitle}",
                            description:"${newDescription}"
                        }){
                            ok
                            error
                        }
                }
            `,
        })
        .expect(200)
        .expect((res) => {
          //   console.log(res.body.data);
          const { ok, error } = res.body.data.editEpisode;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });

    it('should not edit if episode not exist', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
                mutation {
                    editEpisode(
                        input: {
                            id: 3,
                            epTitle:"${newEpTitle}",
                            description:"${newDescription}"
                        }){
                            ok
                            error
                        }
                }
            `,
        })
        .expect(200)
        .expect((res) => {
          //   console.log(res.body.data);
          const { ok, error } = res.body.data.editEpisode;
          expect(ok).toBe(false);
          expect(error).toBe('Could not found eposode');
        });
    });

    it('should not edit if not your podcast', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken2)
        .send({
          query: `
                mutation {
                    editEpisode(
                        input: {
                            id: ${episodeId},
                            epTitle:"${newEpTitle}",
                            description:"${newDescription}"
                        }){
                            ok
                            error
                        }
                }
            `,
        })
        .expect(200)
        .expect((res) => {
          //   console.log(res.body.data);
          const { ok, error } = res.body.data.editEpisode;
          expect(ok).toBe(false);
          expect(error).toBe("You can't do that");
        });
    });
  });

  describe('deleteEpisode', () => {
    let episodeId: number;
    beforeAll(async () => {
      const [episode] = await episodeRepository.find();
      episodeId = episode.id;
    });

    it('should not delete episode if not your podcast', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken2)
        .send({
          query: `
                mutation {
                    deleteEpisode(input:{
                        id:${episodeId}
                    }){
                        ok
                        error
                    }
                }
            `,
        })
        .expect(200)
        .expect((res) => {
          //   console.log(res.body.data);
          const { ok, error } = res.body.data.deleteEpisode;
          expect(ok).toBe(false);
          expect(error).toBe("You can't do that");
        });
    });

    it('should not delete episode if episode not exist', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
                mutation {
                    deleteEpisode(input:{
                        id:3
                    }){
                        ok
                        error
                    }
                }
            `,
        })
        .expect(200)
        .expect((res) => {
          //   console.log(res.body.data);
          const { ok, error } = res.body.data.deleteEpisode;
          expect(ok).toBe(false);
          expect(error).toBe('Episode not found');
        });
    });

    it('should delete episode', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
                mutation {
                    deleteEpisode(input:{
                        id:${episodeId}
                    }){
                        ok
                        error
                    }
                }
            `,
        })
        .expect(200)
        .expect((res) => {
          //   console.log(res.body.data);
          const { ok, error } = res.body.data.deleteEpisode;
          expect(ok).toBe(true);
          expect(error).toBe(null);
        });
    });
  });

  describe('seePodcasts', () => {
    it('should see all podcasts', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .set('X-JWT', jwtToken)
        .send({
          query: `
        {
          podcasts(input:{}){
            ok
            error
            results{
              title
            }
            totalPages
            totalResults
          }
        }
        `,
        })
        .expect(200)
        .expect((res) => {
          const { ok, error, results, totalPages, totalResults } =
            res.body.data.podcasts;
          // console.log(results, totalPages, totalResults);
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(results[0].title).toBe("I'll be back");
          expect(totalPages).toBe(1);
          expect(totalResults).toBe(1);
        });
    });
  });

  //PodcastsModule -----------------------------------------------------------
});
