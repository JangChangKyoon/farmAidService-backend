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

  describe('editPodcast', () => {
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
    const podcastArgs = {
      podcastId: 1,
      title: 'Amagedon',
      category: 'Action',
      rating: 3,
      hostId: 2,
    };
    it('should fail if podcast not exist', async () => {
      podcastsRepository.findOne.mockReturnValue(undefined);

      const result = await service.editPodcast(mockedUser, podcastArgs);

      expect(result).toMatchObject({
        ok: false,
        error: 'Podcast not found',
      });
      expect(podcastsRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should fail if u are not host', async () => {
      podcastsRepository.findOne.mockReturnValue(podcastArgs);

      const result = await service.editPodcast(mockedUser, podcastArgs);

      expect(result).toMatchObject({
        ok: false,
        error: "You can't edit a podcast that you don't host",
      });
    });

    it('should change title', async () => {
      const oldPodcast = {
        title: 'indian jones',
        hostId: 1,
      };
      const newPodcast = {
        title: 'Jurasic Park',
        hostId: 1,
      };
      const editPodcastArg = {
        podcastId: 1,
        title: 'Jurasic Park',
        hostId: 1,
      };

      podcastsRepository.findOne.mockResolvedValue(oldPodcast);

      await service.editPodcast(mockedUser, editPodcastArg);

      expect(podcastsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(podcastsRepository.findOne).toHaveBeenCalledWith({
        where: { id: editPodcastArg.podcastId },
      });

      // expect(result).toEqual({ ok: true });
      expect(podcastsRepository.save).toHaveBeenCalledTimes(1);
      expect(podcastsRepository.save).toHaveBeenCalledWith(newPodcast);
    });

    it('should change category', async () => {
      const oldPodcast = {
        category: 'Action',
        hostId: 1,
      };
      const newPodcast = {
        category: 'Romantic',
        hostId: 1,
      };
      const editPodcastArg = {
        podcastId: 1,
        category: 'Romantic',
        hostId: 1,
      };

      podcastsRepository.findOne.mockResolvedValue(oldPodcast);

      await service.editPodcast(mockedUser, editPodcastArg);

      expect(podcastsRepository.save).toHaveBeenCalledTimes(1);
      expect(podcastsRepository.save).toHaveBeenCalledWith(newPodcast);
    });

    it('should change rating', async () => {
      const oldPodcast = {
        rating: 3,
        hostId: 1,
      };
      const newPodcast = {
        rating: 3,
        hostId: 1,
      };
      const editPodcastArg = {
        podcastId: 1,
        rating: 3,
        hostId: 1,
      };

      podcastsRepository.findOne.mockResolvedValue(oldPodcast);

      await service.editPodcast(mockedUser, editPodcastArg);

      expect(podcastsRepository.save).toHaveBeenCalledTimes(1);
      expect(podcastsRepository.save).toHaveBeenCalledWith(newPodcast);
    });
  });
  describe('deletePodcast', () => {
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
    it('sholud be deleted', async () => {
      const oldPodcast = {
        id: 1,
        title: 'Indiana Jones',
        category: 'Adventure',
        rating: 5,
      };
      const podcastId = {
        podcastId: 1,
      };

      podcastsRepository.findOne.mockResolvedValue(oldPodcast);
      podcastsRepository.findOne.mockResolvedValue(mockedUser.id);
      //   podcastsRepository.delete.mockReturnValue(1);

      //   await service.deletePodcastInput(mockedUser, podcastId);

      //   expect(podcastsRepository.delete).toHaveBeenCalledTimes(1);
      //   expect(podcastsRepository.delete).toHaveBeenCalledWith(podcastId);
    });
  });
});
