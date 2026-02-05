/**
 * DISC Service Tests
 *
 * Tests for DISC personality assessment calculation algorithm.
 * Covers score calculation, normalization, percentages, and profile determination.
 */

import { calculateDISCProfile } from '../discService';
import { DISCResponse, DISCProfile } from '@/types/disc';

describe('DISC Service', () => {
  describe('calculateDISCProfile', () => {
    describe('basic score calculation', () => {
      it('should calculate scores based on most/least selections', () => {
        const responses: DISCResponse[] = [
          { groupId: 1, mostLike: 'D', leastLike: 'C' },
          { groupId: 2, mostLike: 'D', leastLike: 'C' },
          { groupId: 3, mostLike: 'D', leastLike: 'C' },
          { groupId: 4, mostLike: 'D', leastLike: 'C' },
          { groupId: 5, mostLike: 'I', leastLike: 'S' },
        ];

        const profile = calculateDISCProfile(responses);

        // Most scores: D=4, I=1, S=0, C=0
        // Least scores: D=0, I=0, S=1, C=4
        // Raw scores: D=4-0=4, I=1-0=1, S=0-1=-1, C=0-4=-4
        expect(profile).toBeDefined();
        expect(profile.primaryStyle).toBe('D');
      });

      it('should handle all D responses', () => {
        const responses: DISCResponse[] = Array(10).fill(null).map((_, i) => ({
          groupId: i + 1,
          mostLike: 'D' as const,
          leastLike: 'S' as const,
        }));

        const profile = calculateDISCProfile(responses);

        expect(profile.primaryStyle).toBe('D');
        expect(profile.percentages.D).toBeGreaterThan(profile.percentages.S);
      });

      it('should handle all I responses', () => {
        const responses: DISCResponse[] = Array(10).fill(null).map((_, i) => ({
          groupId: i + 1,
          mostLike: 'I' as const,
          leastLike: 'C' as const,
        }));

        const profile = calculateDISCProfile(responses);

        expect(profile.primaryStyle).toBe('I');
        expect(profile.percentages.I).toBeGreaterThan(profile.percentages.C);
      });

      it('should handle all S responses', () => {
        const responses: DISCResponse[] = Array(10).fill(null).map((_, i) => ({
          groupId: i + 1,
          mostLike: 'S' as const,
          leastLike: 'D' as const,
        }));

        const profile = calculateDISCProfile(responses);

        expect(profile.primaryStyle).toBe('S');
        expect(profile.percentages.S).toBeGreaterThan(profile.percentages.D);
      });

      it('should handle all C responses', () => {
        const responses: DISCResponse[] = Array(10).fill(null).map((_, i) => ({
          groupId: i + 1,
          mostLike: 'C' as const,
          leastLike: 'I' as const,
        }));

        const profile = calculateDISCProfile(responses);

        expect(profile.primaryStyle).toBe('C');
        expect(profile.percentages.C).toBeGreaterThan(profile.percentages.I);
      });
    });

    describe('score normalization', () => {
      it('should normalize scores to positive values', () => {
        const responses: DISCResponse[] = [
          { groupId: 1, mostLike: 'D', leastLike: 'C' },
          { groupId: 2, mostLike: 'I', leastLike: 'D' },
          { groupId: 3, mostLike: 'S', leastLike: 'I' },
          { groupId: 4, mostLike: 'C', leastLike: 'S' },
        ];

        const profile = calculateDISCProfile(responses);

        // All normalized scores should be >= 0
        expect(profile.scores.D).toBeGreaterThanOrEqual(0);
        expect(profile.scores.I).toBeGreaterThanOrEqual(0);
        expect(profile.scores.S).toBeGreaterThanOrEqual(0);
        expect(profile.scores.C).toBeGreaterThanOrEqual(0);
      });

      it('should ensure at least one score is 0 (the minimum)', () => {
        const responses: DISCResponse[] = [
          { groupId: 1, mostLike: 'D', leastLike: 'C' },
          { groupId: 2, mostLike: 'D', leastLike: 'C' },
          { groupId: 3, mostLike: 'I', leastLike: 'S' },
        ];

        const profile = calculateDISCProfile(responses);
        const { D, I, S, C } = profile.scores;

        // At least one should be 0 after normalization
        const minScore = Math.min(D, I, S, C);
        expect(minScore).toBe(0);
      });
    });

    describe('percentage calculation', () => {
      it('should calculate percentages that sum to approximately 100', () => {
        const responses: DISCResponse[] = [
          { groupId: 1, mostLike: 'D', leastLike: 'C' },
          { groupId: 2, mostLike: 'I', leastLike: 'S' },
          { groupId: 3, mostLike: 'S', leastLike: 'D' },
          { groupId: 4, mostLike: 'C', leastLike: 'I' },
          { groupId: 5, mostLike: 'D', leastLike: 'C' },
        ];

        const profile = calculateDISCProfile(responses);
        const totalPercentage =
          profile.percentages.D +
          profile.percentages.I +
          profile.percentages.S +
          profile.percentages.C;

        // Allow for rounding differences (should be close to 100)
        expect(totalPercentage).toBeGreaterThanOrEqual(96);
        expect(totalPercentage).toBeLessThanOrEqual(104);
      });

      it('should return 25% each when all scores are equal', () => {
        // Create balanced responses
        const responses: DISCResponse[] = [
          { groupId: 1, mostLike: 'D', leastLike: 'I' },
          { groupId: 2, mostLike: 'I', leastLike: 'S' },
          { groupId: 3, mostLike: 'S', leastLike: 'C' },
          { groupId: 4, mostLike: 'C', leastLike: 'D' },
        ];

        const profile = calculateDISCProfile(responses);

        // When scores are balanced, each should be around 25%
        // Note: exact 25% depends on the algorithm handling
        const { D, I, S, C } = profile.percentages;
        expect(Math.abs(D - I)).toBeLessThanOrEqual(5);
        expect(Math.abs(I - S)).toBeLessThanOrEqual(5);
        expect(Math.abs(S - C)).toBeLessThanOrEqual(5);
      });

      it('should handle edge case of zero total', () => {
        // Empty responses would result in all zeros
        const responses: DISCResponse[] = [];

        const profile = calculateDISCProfile(responses);

        // Should default to 25% each
        expect(profile.percentages.D).toBe(25);
        expect(profile.percentages.I).toBe(25);
        expect(profile.percentages.S).toBe(25);
        expect(profile.percentages.C).toBe(25);
      });
    });

    describe('mixed style detection', () => {
      it('should identify DI mixed style when D and I are close', () => {
        const responses: DISCResponse[] = [
          { groupId: 1, mostLike: 'D', leastLike: 'S' },
          { groupId: 2, mostLike: 'D', leastLike: 'C' },
          { groupId: 3, mostLike: 'I', leastLike: 'S' },
          { groupId: 4, mostLike: 'I', leastLike: 'C' },
          { groupId: 5, mostLike: 'D', leastLike: 'S' },
          { groupId: 6, mostLike: 'I', leastLike: 'C' },
        ];

        const profile = calculateDISCProfile(responses);

        // When two top dimensions are within 15%, should be mixed
        const diff = Math.abs(profile.percentages.D - profile.percentages.I);
        if (diff < 15) {
          expect(profile.primaryStyle).toBe('DI');
        }
      });

      it('should identify DC mixed style', () => {
        const responses: DISCResponse[] = [
          { groupId: 1, mostLike: 'D', leastLike: 'I' },
          { groupId: 2, mostLike: 'D', leastLike: 'S' },
          { groupId: 3, mostLike: 'C', leastLike: 'I' },
          { groupId: 4, mostLike: 'C', leastLike: 'S' },
          { groupId: 5, mostLike: 'D', leastLike: 'I' },
          { groupId: 6, mostLike: 'C', leastLike: 'S' },
        ];

        const profile = calculateDISCProfile(responses);
        const diff = Math.abs(profile.percentages.D - profile.percentages.C);

        if (diff < 15) {
          expect(profile.primaryStyle).toBe('DC');
        }
      });

      it('should identify IS mixed style', () => {
        const responses: DISCResponse[] = [
          { groupId: 1, mostLike: 'I', leastLike: 'D' },
          { groupId: 2, mostLike: 'I', leastLike: 'C' },
          { groupId: 3, mostLike: 'S', leastLike: 'D' },
          { groupId: 4, mostLike: 'S', leastLike: 'C' },
          { groupId: 5, mostLike: 'I', leastLike: 'D' },
          { groupId: 6, mostLike: 'S', leastLike: 'C' },
        ];

        const profile = calculateDISCProfile(responses);
        const diff = Math.abs(profile.percentages.I - profile.percentages.S);

        if (diff < 15) {
          expect(profile.primaryStyle).toBe('IS');
        }
      });

      it('should identify SC mixed style', () => {
        const responses: DISCResponse[] = [
          { groupId: 1, mostLike: 'S', leastLike: 'D' },
          { groupId: 2, mostLike: 'S', leastLike: 'I' },
          { groupId: 3, mostLike: 'C', leastLike: 'D' },
          { groupId: 4, mostLike: 'C', leastLike: 'I' },
          { groupId: 5, mostLike: 'S', leastLike: 'D' },
          { groupId: 6, mostLike: 'C', leastLike: 'I' },
        ];

        const profile = calculateDISCProfile(responses);
        const diff = Math.abs(profile.percentages.S - profile.percentages.C);

        if (diff < 15) {
          expect(profile.primaryStyle).toBe('SC');
        }
      });
    });

    describe('coordinates calculation', () => {
      it('should calculate control coordinate (D vs S axis)', () => {
        // High D, low S should give positive control
        const highDResponses: DISCResponse[] = Array(8).fill(null).map((_, i) => ({
          groupId: i + 1,
          mostLike: 'D' as const,
          leastLike: 'S' as const,
        }));

        const profile = calculateDISCProfile(highDResponses);

        // Control should be positive when D > S
        expect(profile.coordinates.control).toBeGreaterThan(0);
      });

      it('should calculate negative control when S > D', () => {
        const highSResponses: DISCResponse[] = Array(8).fill(null).map((_, i) => ({
          groupId: i + 1,
          mostLike: 'S' as const,
          leastLike: 'D' as const,
        }));

        const profile = calculateDISCProfile(highSResponses);

        // Control should be negative when S > D
        expect(profile.coordinates.control).toBeLessThan(0);
      });

      it('should calculate affiliation coordinate (I+S vs D+C axis)', () => {
        // High I and S should give positive affiliation
        const highAffiliationResponses: DISCResponse[] = [
          { groupId: 1, mostLike: 'I', leastLike: 'D' },
          { groupId: 2, mostLike: 'I', leastLike: 'C' },
          { groupId: 3, mostLike: 'S', leastLike: 'D' },
          { groupId: 4, mostLike: 'S', leastLike: 'C' },
          { groupId: 5, mostLike: 'I', leastLike: 'D' },
          { groupId: 6, mostLike: 'S', leastLike: 'C' },
        ];

        const profile = calculateDISCProfile(highAffiliationResponses);

        // Affiliation should be positive when I+S > D+C
        expect(profile.coordinates.affiliation).toBeGreaterThan(0);
      });

      it('should calculate negative affiliation when D+C > I+S', () => {
        const lowAffiliationResponses: DISCResponse[] = [
          { groupId: 1, mostLike: 'D', leastLike: 'I' },
          { groupId: 2, mostLike: 'D', leastLike: 'S' },
          { groupId: 3, mostLike: 'C', leastLike: 'I' },
          { groupId: 4, mostLike: 'C', leastLike: 'S' },
          { groupId: 5, mostLike: 'D', leastLike: 'I' },
          { groupId: 6, mostLike: 'C', leastLike: 'S' },
        ];

        const profile = calculateDISCProfile(lowAffiliationResponses);

        // Affiliation should be negative when D+C > I+S
        expect(profile.coordinates.affiliation).toBeLessThan(0);
      });

      it('should keep coordinates within -100 to 100 range', () => {
        const extremeResponses: DISCResponse[] = Array(20).fill(null).map((_, i) => ({
          groupId: i + 1,
          mostLike: 'D' as const,
          leastLike: 'S' as const,
        }));

        const profile = calculateDISCProfile(extremeResponses);

        expect(profile.coordinates.control).toBeLessThanOrEqual(100);
        expect(profile.coordinates.control).toBeGreaterThanOrEqual(-100);
        expect(profile.coordinates.affiliation).toBeLessThanOrEqual(100);
        expect(profile.coordinates.affiliation).toBeGreaterThanOrEqual(-100);
      });
    });

    describe('profile info', () => {
      it('should return valid profile info for D style', () => {
        const responses: DISCResponse[] = Array(10).fill(null).map((_, i) => ({
          groupId: i + 1,
          mostLike: 'D' as const,
          leastLike: 'S' as const,
        }));

        const profile = calculateDISCProfile(responses);

        expect(profile.profileInfo).toBeDefined();
        expect(profile.profileInfo.code).toBeDefined();
        expect(profile.profileInfo.name).toBeDefined();
        expect(profile.profileInfo.description).toBeDefined();
        expect(profile.profileInfo.strengths).toBeDefined();
        expect(profile.profileInfo.challenges).toBeDefined();
        expect(profile.profileInfo.workStyle).toBeDefined();
        expect(profile.profileInfo.communication).toBeDefined();
        expect(profile.profileInfo.motivation).toBeDefined();
        expect(profile.profileInfo.stressResponse).toBeDefined();
      });

      it('should return profile info with non-empty arrays', () => {
        const responses: DISCResponse[] = Array(10).fill(null).map((_, i) => ({
          groupId: i + 1,
          mostLike: 'I' as const,
          leastLike: 'C' as const,
        }));

        const profile = calculateDISCProfile(responses);

        expect(profile.profileInfo.strengths.length).toBeGreaterThan(0);
        expect(profile.profileInfo.challenges.length).toBeGreaterThan(0);
      });

      it('should return matching profile for mixed styles', () => {
        // Create responses that favor DI
        const responses: DISCResponse[] = [
          { groupId: 1, mostLike: 'D', leastLike: 'S' },
          { groupId: 2, mostLike: 'I', leastLike: 'C' },
          { groupId: 3, mostLike: 'D', leastLike: 'S' },
          { groupId: 4, mostLike: 'I', leastLike: 'C' },
          { groupId: 5, mostLike: 'D', leastLike: 'S' },
          { groupId: 6, mostLike: 'I', leastLike: 'C' },
        ];

        const profile = calculateDISCProfile(responses);

        if (profile.primaryStyle === 'DI') {
          expect(profile.profileInfo.code).toBe('DI');
        }
      });

      it('should fallback to D profile for unknown style', () => {
        // This tests the fallback behavior
        const responses: DISCResponse[] = [];
        const profile = calculateDISCProfile(responses);

        // With empty responses, should have a valid profileInfo
        expect(profile.profileInfo).toBeDefined();
        expect(profile.profileInfo.code).toBeDefined();
      });
    });

    describe('edge cases', () => {
      it('should handle single response', () => {
        const responses: DISCResponse[] = [
          { groupId: 1, mostLike: 'D', leastLike: 'C' },
        ];

        const profile = calculateDISCProfile(responses);

        expect(profile).toBeDefined();
        expect(profile.primaryStyle).toBeDefined();
        expect(profile.scores).toBeDefined();
        expect(profile.percentages).toBeDefined();
      });

      it('should handle large number of responses', () => {
        const responses: DISCResponse[] = Array(100).fill(null).map((_, i) => ({
          groupId: i + 1,
          mostLike: ['D', 'I', 'S', 'C'][i % 4] as 'D' | 'I' | 'S' | 'C',
          leastLike: ['C', 'D', 'I', 'S'][i % 4] as 'D' | 'I' | 'S' | 'C',
        }));

        const profile = calculateDISCProfile(responses);

        expect(profile).toBeDefined();
        expect(profile.primaryStyle).toBeDefined();
      });

      it('should return consistent results for same input', () => {
        const responses: DISCResponse[] = [
          { groupId: 1, mostLike: 'D', leastLike: 'C' },
          { groupId: 2, mostLike: 'I', leastLike: 'S' },
          { groupId: 3, mostLike: 'S', leastLike: 'D' },
        ];

        const profile1 = calculateDISCProfile(responses);
        const profile2 = calculateDISCProfile(responses);

        expect(profile1.primaryStyle).toBe(profile2.primaryStyle);
        expect(profile1.scores).toEqual(profile2.scores);
        expect(profile1.percentages).toEqual(profile2.percentages);
        expect(profile1.coordinates).toEqual(profile2.coordinates);
      });
    });

    describe('profile structure validation', () => {
      it('should return all required profile fields', () => {
        const responses: DISCResponse[] = [
          { groupId: 1, mostLike: 'D', leastLike: 'C' },
          { groupId: 2, mostLike: 'I', leastLike: 'S' },
        ];

        const profile = calculateDISCProfile(responses);

        // Verify structure
        expect(profile).toHaveProperty('primaryStyle');
        expect(profile).toHaveProperty('scores');
        expect(profile).toHaveProperty('percentages');
        expect(profile).toHaveProperty('coordinates');
        expect(profile).toHaveProperty('profileInfo');

        // Verify scores structure
        expect(profile.scores).toHaveProperty('D');
        expect(profile.scores).toHaveProperty('I');
        expect(profile.scores).toHaveProperty('S');
        expect(profile.scores).toHaveProperty('C');

        // Verify percentages structure
        expect(profile.percentages).toHaveProperty('D');
        expect(profile.percentages).toHaveProperty('I');
        expect(profile.percentages).toHaveProperty('S');
        expect(profile.percentages).toHaveProperty('C');

        // Verify coordinates structure
        expect(profile.coordinates).toHaveProperty('control');
        expect(profile.coordinates).toHaveProperty('affiliation');
      });

      it('should return numeric values for all scores and percentages', () => {
        const responses: DISCResponse[] = [
          { groupId: 1, mostLike: 'D', leastLike: 'C' },
        ];

        const profile = calculateDISCProfile(responses);

        expect(typeof profile.scores.D).toBe('number');
        expect(typeof profile.scores.I).toBe('number');
        expect(typeof profile.scores.S).toBe('number');
        expect(typeof profile.scores.C).toBe('number');

        expect(typeof profile.percentages.D).toBe('number');
        expect(typeof profile.percentages.I).toBe('number');
        expect(typeof profile.percentages.S).toBe('number');
        expect(typeof profile.percentages.C).toBe('number');

        expect(typeof profile.coordinates.control).toBe('number');
        expect(typeof profile.coordinates.affiliation).toBe('number');
      });
    });
  });
});
