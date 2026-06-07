import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import SalonDetailView from '../SalonDetailView.vue';
import { useAppointmentStore } from '@/stores/appointment-store';
import { getWrapperVm } from '@/test-utils';
import type { ICompany } from '@/domain/ICompany';
import type { IService } from '@/domain/IService';
import type { IWorkingHours } from '@/domain/IWorkingHours';
import type { IEmployee } from '@/domain/IEmployee';
import type { ISlotWithDetails } from '@/domain/ISalonDetail';
import { CompanyApiRepository } from '@/repositories/CompanyApiRepository';
import { ServiceApiRepository } from '@/repositories/ServiceApiRepository';
import { WorkingHoursApiRepository } from '@/repositories/WorkingHoursApiRepository';
import { AppointmentSlotApiRepository } from '@/repositories/AppointmentSlotApiRepository';
import { EmployeeApiRepository } from '@/repositories/EmployeeApiRepository';

vi.mock('@/repositories/CompanyApiRepository');
vi.mock('@/repositories/ServiceApiRepository');
vi.mock('@/repositories/WorkingHoursApiRepository');
vi.mock('@/repositories/AppointmentSlotApiRepository');
vi.mock('@/repositories/EmployeeApiRepository');
vi.mock('@/stores/auth-store', () => ({
  useAuthStore: vi.fn(() => ({
    getAuthInfo: vi.fn(() => ({
      jwt: 'test-token',
    })),
    refresh: vi.fn(),
    isLoggedIn: vi.fn(() => true),
  })),
}));

interface SalonDetailViewInstance {
  loading: boolean;
  error: string | null;
  salon: ICompany | null;
  services: IService[];
  workingHours: IWorkingHours[];
  availableSlots: ISlotWithDetails[];
  employees: IEmployee[];
  selectedServiceId: string | null;
  selectedService: IService | null;
  selectedDate: Date | null;
  selectedTimeSlot: ISlotWithDetails | null;
  selectedEmployee: IEmployee | null;
  showConfirmModal: boolean;
  onServiceChange: (serviceId: string) => void;
  onDateSelected: (date: Date) => void;
  onTimeSlotSelected: (slot: ISlotWithDetails) => void;
  onEmployeeSelected: (employee: IEmployee) => void;
  onConfirmAppointment: () => Promise<void>;
  $nextTick: () => Promise<void>;
}

describe('SalonDetailView - Booking Flow Integration', () => {
  let router: ReturnType<typeof createRouter>;
  let pinia: ReturnType<typeof createPinia>;
  let wrapper: VueWrapper;

  const mockCompany: ICompany = {
    id: '1',
    companyName: 'Test Salon',
    companyAddress: '123 Test St',
    companyPhoneNumber: '123-456-7890',
    companyEmail: 'test@example.com',
  };

  const mockServices: IService[] = [
    {
      id: '1',
      serviceName: 'Haircut',
      durationMin: 30,
      price: 50,
      companyId: '1',
      serviceTypeId: '1',
    },
    {
      id: '2',
      serviceName: 'Massage',
      durationMin: 60,
      price: 100,
      companyId: '1',
      serviceTypeId: '2',
    },
  ];

  const mockWorkingHours: IWorkingHours[] = [
    {
      id: '1',
      companyId: '1',
      weekdayIndex: 1,
      startTime: '09:00',
      endTime: '18:00',
      activeSince: new Date().toISOString(),
      activeUntil: null,
      employeeId: '1',
    },
  ];

  const mockEmployees: IEmployee[] = [
    {
      id: '1',
      appUserId: 'user-1',
      email: 'john@example.com',
      phoneNumber: '123-456-7890',
      companyId: '1',
      employeeRoleInCompany: 'Stylist',
      employmentStartedAt: '2024-01-01',
      employmentEndedAt: null,
    },
    {
      id: '2',
      appUserId: 'user-2',
      email: 'jane@example.com',
      phoneNumber: '987-654-3210',
      companyId: '1',
      employeeRoleInCompany: 'Stylist',
      employmentStartedAt: '2024-01-01',
      employmentEndedAt: null,
    },
  ];

  const mockAvailableSlots: ISlotWithDetails[] = [
    {
      id: '1',
      date: '2024-01-15',
      startTime: '10:00',
      endTime: '11:00',
      employee: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '123-456-7890',
        employeeRoleInCompany: 'Stylist',
      },
      employeeServices: [
        {
          id: '1',
          serviceName: 'Haircut',
          durationMin: 30,
          price: 50,
        },
      ],
    },
    {
      id: '2',
      date: '2024-01-15',
      startTime: '14:00',
      endTime: '15:00',
      employee: {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phoneNumber: '987-654-3210',
        employeeRoleInCompany: 'Stylist',
      },
      employeeServices: [
        {
          id: '1',
          serviceName: 'Haircut',
          durationMin: 30,
          price: 50,
        },
      ],
    },
  ];

  beforeEach(async () => {
    vi.clearAllMocks();

    pinia = createPinia();
    setActivePinia(pinia);

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/salon/:id', component: SalonDetailView },
        { path: '/my-appointments', component: { template: '<div>My Appointments</div>' } },
      ],
    });

    await router.push('/salon/1');

    // Mock repository methods to return proper result objects
    vi.mocked(CompanyApiRepository.prototype.get).mockResolvedValue({
      data: mockCompany,
      errors: undefined,
    });

    vi.mocked(ServiceApiRepository.prototype.getByCompany).mockResolvedValue({
      data: mockServices,
      errors: undefined,
    });

    vi.mocked(WorkingHoursApiRepository.prototype.getByCompany).mockResolvedValue({
      data: mockWorkingHours,
      errors: undefined,
    });

    vi.mocked(EmployeeApiRepository.prototype.getByCompany).mockResolvedValue({
      data: mockEmployees,
      errors: undefined,
    });

    vi.mocked(AppointmentSlotApiRepository.prototype.getFiltered).mockResolvedValue({
      data: mockAvailableSlots,
      errors: undefined,
    });

    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Complete Booking Flow', () => {
    it('should complete the booking flow: select service, date, time, employee, and confirm', async () => {
      wrapper = mount(SalonDetailView, {
        global: {
          plugins: [router, pinia],
          stubs: {
            ClientNavigation: true,
            SalonInfo: true,
            SalonWorkingHours: true,
            ServiceFilter: true,
            AppointmentCalendar: true,
            TimeSlotList: true,
            EmployeeList: true,
            ConfirmAppointmentModal: true,
          },
        },
      });

      const vm = getWrapperVm<SalonDetailViewInstance>(wrapper);
      await vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(vm.loading).toBe(false);
      expect(vm.salon).toEqual(mockCompany);
      expect(vm.services).toEqual(mockServices);
      expect(vm.workingHours).toEqual(mockWorkingHours);
      expect(vm.employees).toEqual(mockEmployees);

      vm.onServiceChange('1');
      await vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(vm.selectedServiceId).toBe('1');
      expect(vm.selectedService).toEqual(mockServices[0]!);
      expect(vm.availableSlots).toEqual(mockAvailableSlots);

      const selectedDate = new Date('2024-01-15');
      vm.onDateSelected(selectedDate);
      await vm.$nextTick();

      expect(vm.selectedDate).toEqual(selectedDate);

      vm.onTimeSlotSelected(mockAvailableSlots[0]!);
      await vm.$nextTick();

      expect(vm.selectedTimeSlot).toEqual(mockAvailableSlots[0]!);

      vm.onEmployeeSelected(mockEmployees[0]!);
      await vm.$nextTick();

      expect(vm.selectedEmployee).toEqual(mockEmployees[0]!);
      expect(vm.showConfirmModal).toBe(true);

      const appointmentStore = useAppointmentStore();
      const selectServiceSpy = vi.spyOn(appointmentStore, 'selectService');
      const selectTimeSlotSpy = vi.spyOn(appointmentStore, 'selectTimeSlot');
      const selectDateSpy = vi.spyOn(appointmentStore, 'selectDate');
      vi.spyOn(appointmentStore, 'createAppointment').mockResolvedValueOnce();

      await vm.onConfirmAppointment();
      await vm.$nextTick();

      expect(selectServiceSpy).toHaveBeenCalledWith(mockServices[0]!);
      expect(selectTimeSlotSpy).toHaveBeenCalledWith(mockAvailableSlots[0]!);
      expect(selectDateSpy).toHaveBeenCalledWith(selectedDate);
      expect(appointmentStore.createAppointment).toHaveBeenCalled();
      expect(vm.showConfirmModal).toBe(false);
    });

    it('should reset selections when service changes', async () => {
      wrapper = mount(SalonDetailView, {
        global: {
          plugins: [router, pinia],
          stubs: {
            ClientNavigation: true,
            SalonInfo: true,
            SalonWorkingHours: true,
            ServiceFilter: true,
            AppointmentCalendar: true,
            TimeSlotList: true,
            EmployeeList: true,
            ConfirmAppointmentModal: true,
          },
        },
      });

      const vm = getWrapperVm<SalonDetailViewInstance>(wrapper);
      await vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      vm.onServiceChange('1');
      await vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const selectedDate = new Date('2024-01-15');
      vm.onDateSelected(selectedDate);
      await vm.$nextTick();

      vm.onTimeSlotSelected(mockAvailableSlots[0]!);
      await vm.$nextTick();

      vm.onEmployeeSelected(mockEmployees[0]!);
      await vm.$nextTick();

      expect(vm.selectedServiceId).toBe('1');
      expect(vm.selectedDate).toEqual(selectedDate);
      expect(vm.selectedTimeSlot).toEqual(mockAvailableSlots[0]!);
      expect(vm.selectedEmployee).toEqual(mockEmployees[0]!);

      vm.onServiceChange('2');
      await vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(vm.selectedServiceId).toBe('2');
      expect(vm.selectedDate).toBeNull();
      expect(vm.selectedTimeSlot).toBeNull();
      expect(vm.selectedEmployee).toBeNull();
    });

    it('should reset time and employee when date changes', async () => {
      wrapper = mount(SalonDetailView, {
        global: {
          plugins: [router, pinia],
          stubs: {
            ClientNavigation: true,
            SalonInfo: true,
            SalonWorkingHours: true,
            ServiceFilter: true,
            AppointmentCalendar: true,
            TimeSlotList: true,
            EmployeeList: true,
            ConfirmAppointmentModal: true,
          },
        },
      });

      const vm = getWrapperVm<SalonDetailViewInstance>(wrapper);
      await vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      vm.onServiceChange('1');
      await vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const selectedDate1 = new Date('2024-01-15');
      vm.onDateSelected(selectedDate1);
      await vm.$nextTick();

      vm.onTimeSlotSelected(mockAvailableSlots[0]!);
      await vm.$nextTick();

      vm.onEmployeeSelected(mockEmployees[0]!);
      await vm.$nextTick();

      expect(vm.selectedDate).toEqual(selectedDate1);
      expect(vm.selectedTimeSlot).toEqual(mockAvailableSlots[0]!);
      expect(vm.selectedEmployee).toEqual(mockEmployees[0]!);

      const selectedDate2 = new Date('2024-01-20');
      vm.onDateSelected(selectedDate2);
      await vm.$nextTick();

      expect(vm.selectedDate).toEqual(selectedDate2);
      expect(vm.selectedTimeSlot).toBeNull();
      expect(vm.selectedEmployee).toBeNull();
    });

    it('should reset employee when time slot changes', async () => {
      wrapper = mount(SalonDetailView, {
        global: {
          plugins: [router, pinia],
          stubs: {
            ClientNavigation: true,
            SalonInfo: true,
            SalonWorkingHours: true,
            ServiceFilter: true,
            AppointmentCalendar: true,
            TimeSlotList: true,
            EmployeeList: true,
            ConfirmAppointmentModal: true,
          },
        },
      });

      const vm = getWrapperVm<SalonDetailViewInstance>(wrapper);
      await vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      vm.onServiceChange('1');
      await vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const selectedDate = new Date('2024-01-15');
      vm.onDateSelected(selectedDate);
      await vm.$nextTick();

      vm.onTimeSlotSelected(mockAvailableSlots[0]!);
      await vm.$nextTick();

      vm.onEmployeeSelected(mockEmployees[0]!);
      await vm.$nextTick();

      expect(vm.selectedTimeSlot).toEqual(mockAvailableSlots[0]!);
      expect(vm.selectedEmployee).toEqual(mockEmployees[0]!);

      vm.onTimeSlotSelected(mockAvailableSlots[1]!);
      await vm.$nextTick();

      expect(vm.selectedTimeSlot).toEqual(mockAvailableSlots[1]!);
      expect(vm.selectedEmployee).toBeNull();
    });

    it('should handle error during appointment creation', async () => {
      wrapper = mount(SalonDetailView, {
        global: {
          plugins: [router, pinia],
          stubs: {
            ClientNavigation: true,
            SalonInfo: true,
            SalonWorkingHours: true,
            ServiceFilter: true,
            AppointmentCalendar: true,
            TimeSlotList: true,
            EmployeeList: true,
            ConfirmAppointmentModal: true,
          },
        },
      });

      const vm = getWrapperVm<SalonDetailViewInstance>(wrapper);
      await vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      vm.onServiceChange('1');
      await vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const selectedDate = new Date('2024-01-15');
      vm.onDateSelected(selectedDate);
      await vm.$nextTick();

      vm.onTimeSlotSelected(mockAvailableSlots[0]!);
      await vm.$nextTick();

      vm.onEmployeeSelected(mockEmployees[0]!);
      await vm.$nextTick();

      const appointmentStore = useAppointmentStore();
      vi.spyOn(appointmentStore, 'createAppointment').mockImplementation(async () => {
        appointmentStore.error = 'Test error';
      });

      await vm.onConfirmAppointment();
      await vm.$nextTick();

      expect(vm.error).toBe('Test error');
      expect(vm.showConfirmModal).toBe(false);
    });
  });

  describe('Loading and Error States', () => {
    it('should show loading state initially', async () => {
      vi.mocked(CompanyApiRepository.prototype.get).mockImplementation(() => new Promise(() => {}));

      wrapper = mount(SalonDetailView, {
        global: {
          plugins: [router, pinia],
          stubs: {
            ClientNavigation: true,
            SalonInfo: true,
            SalonWorkingHours: true,
            ServiceFilter: true,
            AppointmentCalendar: true,
            TimeSlotList: true,
            EmployeeList: true,
            ConfirmAppointmentModal: true,
          },
        },
      });

      const vm = getWrapperVm<SalonDetailViewInstance>(wrapper);
      await vm.$nextTick();

      expect(vm.loading).toBe(true);
    });

    it('should show error state on fetch failure', async () => {
      vi.mocked(CompanyApiRepository.prototype.get).mockResolvedValue({
        data: undefined,
        errors: ['Not found'],
      });

      wrapper = mount(SalonDetailView, {
        global: {
          plugins: [router, pinia],
          stubs: {
            ClientNavigation: true,
            SalonInfo: true,
            SalonWorkingHours: true,
            ServiceFilter: true,
            AppointmentCalendar: true,
            TimeSlotList: true,
            EmployeeList: true,
            ConfirmAppointmentModal: true,
          },
        },
      });

      const vm = getWrapperVm<SalonDetailViewInstance>(wrapper);
      await vm.$nextTick();
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(vm.loading).toBe(false);
      expect(vm.error).toBeDefined();
    });
  });
});
