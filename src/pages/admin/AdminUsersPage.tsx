import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';

interface AdminUserView {
  id: string;
  email: string;
  roles: string[];
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            User Directory & Access Control
          </h2>
          <p className="text-xs text-slate-400">
            Audit registered candidate accounts, email verification status, and granted roles
          </p>
        </div>

        <GlassButton
          variant="glass"
          size="sm"
          icon={RefreshCw}
          loading={loading}
          onClick={fetchUsers}
        >
          Refresh Directory
        </GlassButton>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">User Email</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Assigned Roles</th>
                <th className="py-3.5 px-4">Registered On</th>
                <th className="py-3.5 px-4">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-white">
                    {u.email}
                  </td>
                  <td className="py-3.5 px-4">
                    {u.isEmailVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Pending OTP
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map(r => (
                        <span
                          key={r}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            r === 'ROLE_ADMIN'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold'
                              : 'bg-white/5 text-slate-300 border-white/10'
                          }`}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('en-IN') : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
