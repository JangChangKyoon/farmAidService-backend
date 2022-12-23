import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Podcast } from './entities/podcasts.entity';
import { PodcastsService } from './podcasts.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PodcastService', () => {
  let service: PodcastsService;

  let podcastsRepository: MockRepository<Podcast>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PodcastsService,
        {
          provide: getRepositoryToken(Podcast),
          useValue: mockRepository(),
        },
      ],
    }).compile();
    service = module.get<PodcastsService>(PodcastsService);
    podcastsRepository = module.get(getRepositoryToken(Podcast));
  });

  describe('createPodcast', () => {
    const createPodcastArgs = {
      title: 'metrix',
      category: 'Action',
      rating: 3,
    };
    const mockedUser = {
      id: 1,
      hashPassword: jest.fn(),
      checkPassword: jest.fn(() => Promise.resolve(true)),
      role: UserRole.Host,
      email: 'jang@jang.ok',
      password: 'jang.password',
      createAt: new Date(),
      updateAt: new Date(),
    };

    it('should create a new user', async () => {
      podcastsRepository.create.mockResolvedValue(createPodcastArgs);

      await service.createPodcast(mockedUser, createPodcastArgs);

      expect(podcastsRepository.create).toHaveBeenCalledTimes(1);
      expect(podcastsRepository.create).toHaveBeenLastCalledWith(
        createPodcastArgs,
      );
    });

    it('should fail on exception', async () => {
      podcastsRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createPodcast(mockedUser, createPodcastArgs);
      expect(result).toEqual({ ok: false, error: 'Could not create podcast' });
    });
  });
});
