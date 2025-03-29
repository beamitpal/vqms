import { prisma } from '@/lib/prisma';
import { getSystemStats, getBusinessGrowth } from '../../src/actions/admin/stats';


jest.mock('@/lib/prisma', () => ({
  prisma: {
    business: { count: jest.fn(), groupBy: jest.fn() },
    project: { count: jest.fn() },
    user: { count: jest.fn() },
  },
}));

describe('Admin Stats Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  describe('getSystemStats', () => {
    it('should return system stats correctly', async () => {
      (prisma.business.count as jest.Mock).mockResolvedValue(10);
      (prisma.project.count as jest.Mock).mockResolvedValue(50);
      (prisma.user.count as jest.Mock).mockResolvedValue(200);

      const stats = await getSystemStats();

      expect(stats).toEqual({
        totalBusinesses: 10,
        totalProjects: 50,
        totalUsers: 200,
        avgProjectsPerBusiness: 5,
        avgUsersPerBusiness: 20,
      });
      expect(prisma.business.count).toHaveBeenCalled();
    });

    it('should handle zero businesses gracefully', async () => {
      (prisma.business.count as jest.Mock).mockResolvedValue(0);
      (prisma.project.count as jest.Mock).mockResolvedValue(0);
      (prisma.user.count as jest.Mock).mockResolvedValue(0);

      const stats = await getSystemStats();

      expect(stats.avgProjectsPerBusiness).toBe(0);
      expect(stats.avgUsersPerBusiness).toBe(0);
    });
  });

  describe('getBusinessGrowth', () => {
    it('should return time series data for business growth', async () => {
      const mockData = [
        { createdAt: new Date('2025-03-01'), _count: { id: 2 } },
        { createdAt: new Date('2025-03-02'), _count: { id: 3 } },
      ];
      (prisma.business.groupBy as jest.Mock).mockResolvedValue(mockData);

      const result = await getBusinessGrowth();

      expect(result).toEqual([
        { date: '2025-03-01', value: 2 },
        { date: '2025-03-02', value: 3 },
      ]);
      expect(prisma.business.groupBy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object),
          by: 'createdAt',
          _count: { id: true },
        })
      );
    });
  });
});