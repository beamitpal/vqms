import { prisma } from '@/lib/prisma';
import { createProject, listAllProjects, updateProjectStatus } from '../../src/actions/business/projects'; // Adjust path
import { ProjectStatus } from '@prisma/client';

jest.mock('@/lib/prisma');

describe('Business Projects Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listAllProjects', () => {
    it('should list all projects for a business', async () => {
      const mockProjects = [{ id: '1', name: 'Test Project', businessId: 'biz1' }];
      (prisma.project.findMany as jest.Mock).mockResolvedValue(mockProjects);

      const result = await listAllProjects({ businessId: 'biz1' });

      expect(result).toEqual(mockProjects);
      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { businessId: 'biz1' } })
      );
    });
  });

  describe('createProject', () => {
    it('should create a project successfully', async () => {
      const mockProject = { id: '1', businessId: 'biz1', name: 'New Project' };
      (prisma.business.upsert as jest.Mock).mockResolvedValue({});
      (prisma.project.create as jest.Mock).mockResolvedValue(mockProject);

      const projectData = {
        businessId: 'biz1', // Added required field
        name: 'New Project',
        description: 'Test',
        username: 'testproj',
        status: 'PUBLIC' as ProjectStatus,
        apiKey: 'key',
        customFields: null, // Added required field
      };

      const result = await createProject('biz1', 'test@example.com', projectData);

      expect(result).toEqual(mockProject);
      expect(prisma.project.create).toHaveBeenCalled();
    });
  });

  describe('updateProjectStatus', () => {
    it('should update project status', async () => {
      const mockUpdated = { id: '1', status: 'PRIVATE' };
      (prisma.project.update as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await updateProjectStatus('1', 'biz1', 'PRIVATE');

      expect(result).toEqual(mockUpdated);
      expect(prisma.project.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1', businessId: 'biz1' },
          data: expect.objectContaining({ status: 'PRIVATE' }),
        })
      );
    });
  });
});