import { describe, it, expect, vi, afterEach } from 'vitest';
import type { IUserAppointment } from '../../domain/ISalonDetail';
import {
  isAppointmentUpcoming,
  isAppointmentPast,
  canCancelAppointment,
  formatAppointmentDate,
  formatAppointmentStatus,
} from '../appointment-helpers';

describe('appointment-helpers', () => {
  describe('isAppointmentUpcoming', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return true for future appointment', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const appointment: IUserAppointment = {
        id: '1',
        appointmentStatus: 'Confirmed',
        companyName: 'Test Salon',
        companyAddress: '123 Test St',
        date: futureDate.toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        serviceName: 'Haircut',
        price: 50,
        serviceTypeName: 'Hair',
      };
      expect(isAppointmentUpcoming(appointment)).toBe(true);
    });

    it('should return false for past appointment', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const appointment: IUserAppointment = {
        id: '1',
        appointmentStatus: 'Confirmed',
        companyName: 'Test Salon',
        companyAddress: '123 Test St',
        date: pastDate.toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        serviceName: 'Haircut',
        price: 50,
        serviceTypeName: 'Hair',
      };
      expect(isAppointmentUpcoming(appointment)).toBe(false);
    });

    it('should return true for today appointment with future time', () => {
      const today = new Date();
      const futureTime = new Date(today);
      futureTime.setHours(today.getHours() + 2);
      const appointment: IUserAppointment = {
        id: '1',
        appointmentStatus: 'Confirmed',
        companyName: 'Test Salon',
        companyAddress: '123 Test St',
        date: today.toISOString().split('T')[0],
        startTime: `${futureTime.getHours()}:00`,
        endTime: `${futureTime.getHours() + 1}:00`,
        serviceName: 'Haircut',
        price: 50,
        serviceTypeName: 'Hair',
      };
      expect(isAppointmentUpcoming(appointment)).toBe(true);
    });

    it('should return false for today appointment with past time', () => {
      const today = new Date();
      const pastTime = new Date(today);
      pastTime.setHours(today.getHours() - 2);
      const appointment: IUserAppointment = {
        id: '1',
        appointmentStatus: 'Confirmed',
        companyName: 'Test Salon',
        companyAddress: '123 Test St',
        date: today.toISOString().split('T')[0],
        startTime: `${pastTime.getHours()}:00`,
        endTime: `${pastTime.getHours() + 1}:00`,
        serviceName: 'Haircut',
        price: 50,
        serviceTypeName: 'Hair',
      };
      expect(isAppointmentUpcoming(appointment)).toBe(false);
    });

    it('should return true for today appointment with current time', () => {
      const today = new Date();
      const appointment: IUserAppointment = {
        id: '1',
        appointmentStatus: 'Confirmed',
        companyName: 'Test Salon',
        companyAddress: '123 Test St',
        date: today.toISOString().split('T')[0],
        startTime: `${today.getHours()}:${today.getMinutes()}`,
        endTime: `${today.getHours() + 1}:${today.getMinutes()}`,
        serviceName: 'Haircut',
        price: 50,
        serviceTypeName: 'Hair',
      };
      expect(isAppointmentUpcoming(appointment)).toBe(true);
    });
  });

  describe('isAppointmentPast', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return true for past appointment', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const appointment: IUserAppointment = {
        id: '1',
        appointmentStatus: 'Confirmed',
        companyName: 'Test Salon',
        companyAddress: '123 Test St',
        date: pastDate.toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        serviceName: 'Haircut',
        price: 50,
        serviceTypeName: 'Hair',
      };
      expect(isAppointmentPast(appointment)).toBe(true);
    });

    it('should return false for future appointment', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const appointment: IUserAppointment = {
        id: '1',
        appointmentStatus: 'Confirmed',
        companyName: 'Test Salon',
        companyAddress: '123 Test St',
        date: futureDate.toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        serviceName: 'Haircut',
        price: 50,
        serviceTypeName: 'Hair',
      };
      expect(isAppointmentPast(appointment)).toBe(false);
    });

    it('should return false for today appointment with future time', () => {
      const today = new Date();
      const futureTime = new Date(today);
      futureTime.setHours(today.getHours() + 2);
      const appointment: IUserAppointment = {
        id: '1',
        appointmentStatus: 'Confirmed',
        companyName: 'Test Salon',
        companyAddress: '123 Test St',
        date: today.toISOString().split('T')[0],
        startTime: `${futureTime.getHours()}:00`,
        endTime: `${futureTime.getHours() + 1}:00`,
        serviceName: 'Haircut',
        price: 50,
        serviceTypeName: 'Hair',
      };
      expect(isAppointmentPast(appointment)).toBe(false);
    });
  });

  describe('canCancelAppointment', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return true for upcoming confirmed appointment', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const appointment: IUserAppointment = {
        id: '1',
        appointmentStatus: 'Confirmed',
        companyName: 'Test Salon',
        companyAddress: '123 Test St',
        date: futureDate.toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        serviceName: 'Haircut',
        price: 50,
        serviceTypeName: 'Hair',
      };
      expect(canCancelAppointment(appointment)).toBe(true);
    });

    it('should return false for cancelled appointment', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const appointment: IUserAppointment = {
        id: '1',
        appointmentStatus: 'Cancelled',
        companyName: 'Test Salon',
        companyAddress: '123 Test St',
        date: futureDate.toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        serviceName: 'Haircut',
        price: 50,
        serviceTypeName: 'Hair',
      };
      expect(canCancelAppointment(appointment)).toBe(false);
    });

    it('should return false for past appointment', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const appointment: IUserAppointment = {
        id: '1',
        appointmentStatus: 'Confirmed',
        companyName: 'Test Salon',
        companyAddress: '123 Test St',
        date: pastDate.toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        serviceName: 'Haircut',
        price: 50,
        serviceTypeName: 'Hair',
      };
      expect(canCancelAppointment(appointment)).toBe(false);
    });

    it('should return true for upcoming appointment with different status casing', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const appointment: IUserAppointment = {
        id: '1',
        appointmentStatus: 'confirmed',
        companyName: 'Test Salon',
        companyAddress: '123 Test St',
        date: futureDate.toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        serviceName: 'Haircut',
        price: 50,
        serviceTypeName: 'Hair',
      };
      expect(canCancelAppointment(appointment)).toBe(true);
    });
  });

  describe('formatAppointmentDate', () => {
    it('should format appointment date correctly', () => {
      const date = '2024-01-15';
      const time = '10:00';
      const result = formatAppointmentDate(date, time);
      expect(result).toContain('January');
      expect(result).toContain('15');
      expect(result).toContain('2024');
      expect(result).toContain('10:00');
    });

    it('should format appointment date with different month', () => {
      const date = '2024-12-25';
      const time = '14:30';
      const result = formatAppointmentDate(date, time);
      expect(result).toContain('December');
      expect(result).toContain('25');
      expect(result).toContain('2024');
      expect(result).toContain('14:30');
    });

    it('should format appointment date with time including minutes', () => {
      const date = '2024-06-10';
      const time = '09:45';
      const result = formatAppointmentDate(date, time);
      expect(result).toContain('June');
      expect(result).toContain('10');
      expect(result).toContain('2024');
      expect(result).toContain('09:45');
    });
  });

  describe('formatAppointmentStatus', () => {
    it('should capitalize first letter and lowercase rest', () => {
      expect(formatAppointmentStatus('confirmed')).toBe('Confirmed');
      expect(formatAppointmentStatus('CANCELLED')).toBe('Cancelled');
      expect(formatAppointmentStatus('Pending')).toBe('Pending');
    });

    it('should return empty string for null or undefined', () => {
      expect(formatAppointmentStatus('')).toBe('');
      expect(formatAppointmentStatus(null as unknown as string)).toBe('');
      expect(formatAppointmentStatus(undefined as unknown as string)).toBe('');
    });

    it('should handle single character status', () => {
      expect(formatAppointmentStatus('a')).toBe('A');
      expect(formatAppointmentStatus('B')).toBe('B');
    });

    it('should handle status with special characters', () => {
      expect(formatAppointmentStatus('in-progress')).toBe('In-progress');
      expect(formatAppointmentStatus('NO_SHOW')).toBe('No_show');
    });
  });
});
