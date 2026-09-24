import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  usn?: string;
  department?: string;
  year_of_study?: string;
  phone?: string;
  ieee_member_id?: string;
}

export interface Announcement {
  id?: string;
  message: string;
  link_url?: string;
  is_active: boolean;
  updated_at?: string;
}

export const DUMMY_CREDENTIALS = {
  email: 'test@bmsce.ac.in',
  password: 'password123',
};

export const DUMMY_ADMIN_CREDENTIALS = {
  email: 'admin@bmsce.ac.in',
  password: 'adminpassword',
};

const DUMMY_USER_KEY = 'bmsce_dummy_user';
const DUMMY_ADMIN_KEY = 'bmsce_dummy_admin';
const DUMMY_PROFILE_KEY = 'bmsce_dummy_profile';
const DUMMY_ORDERS_KEY = 'bmsce_dummy_orders';
const ANNOUNCEMENT_KEY = 'bmsce_announcement';

// Initial sample orders for demonstration/testing
const SAMPLE_INITIAL_ORDERS = [
  {
    id: 'ord-demo-001',
    user_id: 'user-sample-01',
    student_name: 'Rahul Varma',
    usn: '1BM23CS084',
    email: 'rahul.cs23@bmsce.ac.in',
    department: 'CSE',
    year_of_study: '2',
    phone: '+91 9845012345',
    base_fee: 250,
    total_amount: 450,
    payment_screenshot_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    utr_reference: '423984572910',
    order_reference: 'BMSCE-X8K92A',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    chapters: ['Computer Society', 'Power & Energy'],
  },
  {
    id: 'ord-demo-002',
    user_id: 'user-sample-02',
    student_name: 'Pooja Hegde',
    usn: '1BM23EC042',
    email: 'pooja.ec23@bmsce.ac.in',
    department: 'ECE',
    year_of_study: '3',
    phone: '+91 9741098765',
    base_fee: 250,
    total_amount: 300,
    payment_screenshot_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
    utr_reference: '423910293847',
    order_reference: 'BMSCE-P4M19Q',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    chapters: ['Women In Engineering'],
  },
  {
    id: 'ord-demo-003',
    user_id: 'user-sample-03',
    student_name: 'Karthik Rao',
    usn: '1BM22IS035',
    email: 'karthik.is22@bmsce.ac.in',
    department: 'ISE',
    year_of_study: '3',
    phone: '+91 9448011223',
    base_fee: 250,
    total_amount: 350,
    payment_screenshot_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    utr_reference: '423891029384',
    order_reference: 'BMSCE-Z7T33K',
    status: 'verified',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    verified_at: new Date(Date.now() - 43200000).toISOString(),
    chapters: ['Computer Society'],
  },
];

export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return user;
  } catch (e) {
    // Supabase placeholder
  }

  if (typeof window !== 'undefined') {
    const dummy = localStorage.getItem(DUMMY_USER_KEY);
    if (dummy) return JSON.parse(dummy);
  }
  return null;
}

export function setDummySession(email: string = DUMMY_CREDENTIALS.email) {
  if (typeof window !== 'undefined') {
    const dummyUser = {
      id: 'dummy-usr-' + Math.random().toString(36).substring(2, 9),
      email,
      email_confirmed_at: new Date().toISOString(),
      user_metadata: { is_dummy: true }
    };
    localStorage.setItem(DUMMY_USER_KEY, JSON.stringify(dummyUser));
    return dummyUser;
  }
  return null;
}

export function clearUserSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DUMMY_USER_KEY);
  }
  supabase.auth.signOut().catch(() => {});
}

// Admin Auth
export async function getAdminUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Check if user is present in admins table
      const { data: adminRecord } = await supabase
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .single();
      if (adminRecord) return { ...user, role: adminRecord.role };
    }
  } catch (e) {
    // Fallback to local admin
  }

  if (typeof window !== 'undefined') {
    const admin = localStorage.getItem(DUMMY_ADMIN_KEY);
    if (admin) return JSON.parse(admin);
  }
  return null;
}

export function setDummyAdminSession(email: string = DUMMY_ADMIN_CREDENTIALS.email) {
  if (typeof window !== 'undefined') {
    const adminUser = {
      id: 'admin-usr-001',
      email,
      role: 'admin',
      full_name: 'Branch Executive Chair',
      is_admin: true,
    };
    localStorage.setItem(DUMMY_ADMIN_KEY, JSON.stringify(adminUser));
    return adminUser;
  }
  return null;
}

export function clearAdminSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DUMMY_ADMIN_KEY);
  }
}

// Profiles
export function saveLocalProfile(profile: UserProfile) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DUMMY_PROFILE_KEY, JSON.stringify(profile));
  }
}

export function getLocalProfile(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(DUMMY_PROFILE_KEY);
    if (stored) return JSON.parse(stored);
  }
  return null;
}

// Orders
export function saveLocalOrder(order: any) {
  if (typeof window !== 'undefined') {
    const existing = getLocalOrders();
    // Get profile for metadata
    const prof = getLocalProfile();
    const enrichedOrder = {
      ...order,
      student_name: prof?.full_name || order.student_name || 'BMSCE Student',
      usn: prof?.usn || order.usn || '1BM23CS001',
      email: prof?.email || order.email || 'test@bmsce.ac.in',
      department: prof?.department || order.department || 'CSE',
      year_of_study: prof?.year_of_study || order.year_of_study || '2',
      phone: prof?.phone || order.phone || '',
    };
    const updated = [enrichedOrder, ...existing.filter(o => o.id !== order.id)];
    localStorage.setItem(DUMMY_ORDERS_KEY, JSON.stringify(updated));
  }
}

export function getLocalOrders(): any[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(DUMMY_ORDERS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    // Seed initial mock orders on first run
    localStorage.setItem(DUMMY_ORDERS_KEY, JSON.stringify(SAMPLE_INITIAL_ORDERS));
    return SAMPLE_INITIAL_ORDERS;
  }
  return [];
}

export function updateLocalOrderStatus(
  orderId: string,
  status: 'verified' | 'rejected',
  rejectionReason?: string
) {
  if (typeof window !== 'undefined') {
    const orders = getLocalOrders();
    const updated = orders.map(ord => {
      if (ord.id === orderId || ord.order_reference === orderId) {
        return {
          ...ord,
          status,
          verified_at: status === 'verified' ? new Date().toISOString() : undefined,
          rejection_reason: rejectionReason,
        };
      }
      return ord;
    });
    localStorage.setItem(DUMMY_ORDERS_KEY, JSON.stringify(updated));
    return updated.find(o => o.id === orderId || o.order_reference === orderId);
  }
  return null;
}

export function resubmitLocalOrderProof(orderId: string, screenshotUrl: string, utrReference?: string) {
  if (typeof window !== 'undefined') {
    const orders = getLocalOrders();
    const updated = orders.map(ord => {
      if (ord.id === orderId || ord.order_reference === orderId) {
        return {
          ...ord,
          status: 'pending',
          payment_screenshot_url: screenshotUrl,
          utr_reference: utrReference || ord.utr_reference,
          rejection_reason: undefined,
          updated_at: new Date().toISOString(),
        };
      }
      return ord;
    });
    localStorage.setItem(DUMMY_ORDERS_KEY, JSON.stringify(updated));
    return updated.find(o => o.id === orderId || o.order_reference === orderId);
  }
  return null;
}

// Announcement Banner
export function getAnnouncement(): Announcement {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(ANNOUNCEMENT_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {}
    }
  }
  return {
    message: 'Membership Drive 2026 is LIVE! Register today to access IEEE chapters and technical resources.',
    link_url: '/membership/register',
    is_active: true,
  };
}

export function saveAnnouncement(announcement: Announcement) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ANNOUNCEMENT_KEY, JSON.stringify(announcement));
  }
}
