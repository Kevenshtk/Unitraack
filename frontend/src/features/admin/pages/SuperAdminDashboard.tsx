import { useState, useEffect, useCallback } from 'react';
import { Building2, Users, LogOut, BarChart3, LayoutDashboard, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { MobileNav } from '../../requests/components/dashboard/MobileNav';
import { NotificationDropdown } from '../../requests/components/dashboard/NotificationDropdown';
import { superAdminService } from '../api/superAdminService';
import { useSuperAdminTenants } from '../hooks/useSuperAdminTenants';
import { useSuperAdminUsers } from '../hooks/useSuperAdminUsers';
import { useSuperAdminStats } from '../hooks/useSuperAdminStats';
import { PlatformStatsCards } from '../components/superadmin/PlatformStatsCards';
import { TenantsManagementView } from '../components/superadmin/TenantsManagementView';
import { TenantFormModal } from '../components/superadmin/TenantFormModal';
import { GlobalUsersView } from '../components/superadmin/GlobalUsersView';
import { TenantAuditView } from '../components/superadmin/TenantAuditView';
import { SUPER_ADMIN_HEADER_TITLES, type SuperAdminTab } from '../components/superadmin/types';

export default function SuperAdminDashboard() {
  const { signOut, user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<SuperAdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const usersHook = useSuperAdminUsers();
  const statsHook = useSuperAdminStats(activeTab);
  const fetchData = useCallback(async () => { setRefreshTrigger(c => c + 1); }, []);
  const tenantsHook = useSuperAdminTenants({ onRefreshAll: fetchData });

  const { setTenants } = tenantsHook;
  const { setAllUsers } = usersHook;
  const { setStats } = statsHook;

  useEffect(() => {
    if (!user) return;
    let active = true;
    Promise.all([
      superAdminService.listTenants(),
      superAdminService.getPlatformStats(),
      superAdminService.listAllUsers()
    ])
      .then(([loadedTenants, loadedStats, loadedUsers]) => {
        if (!active) return;
        setTenants(loadedTenants);
        setStats(loadedStats);
        setAllUsers(loadedUsers);
      })
      .catch((err) => console.error('[SuperAdminDashboard] Erro ao buscar dados iniciais:', err));
    return () => { active = false; };
  }, [user, refreshTrigger, setTenants, setStats, setAllUsers]);

  const navItems = [
    { id: 'dashboard', label: 'Painel', sidebarLabel: 'Início / Painel', icon: <LayoutDashboard className="w-[18px] h-[18px] shrink-0" /> },
    { id: 'tenants', label: 'Usinas', sidebarLabel: 'Gerenciar Usinas', icon: <Building2 className="w-[18px] h-[18px] shrink-0" /> },
    { id: 'users', label: 'Usuários', sidebarLabel: 'Gerenciamento de Usuários', icon: <Users className="w-[18px] h-[18px] shrink-0" /> },
    { id: 'monitoring', label: 'Auditoria', sidebarLabel: 'Auditoria & Rastro', icon: <BarChart3 className="w-[18px] h-[18px] shrink-0" /> }
  ];

  const userInitial = profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'D';

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] flex-col lg:flex-row font-brand antialiased text-navy">
      <aside className={`hidden lg:flex ${isSidebarOpen ? 'w-60' : 'w-20'} bg-navy flex-col shrink-0 border-r border-white/10 shadow-2xl z-50 select-none relative transition-all duration-300 ease-in-out`}>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3.5 top-5 w-7 h-7 bg-white border border-slate-200/80 rounded-full shadow-md flex items-center justify-center text-slate-600 hover:text-navy hover:scale-105 transition-all z-50 cursor-pointer"
          title={isSidebarOpen ? 'Recolher menu' : 'Expandir menu'}
        >
          {isSidebarOpen ? <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" /> : <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />}
        </button>

        <div className={`px-4 h-16 flex items-center ${!isSidebarOpen ? 'justify-center' : 'gap-3'} border-b border-white/10 shrink-0 overflow-hidden`}>
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-primary/30">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col leading-none">
              <span className="text-white font-bold text-sm tracking-tight">Unitraack</span>
              <span className="text-[10px] text-primary font-semibold tracking-wider uppercase mt-0.5">Global Admin</span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as SuperAdminTab)}
              title={!isSidebarOpen ? item.sidebarLabel : undefined}
              className={`w-full flex items-center ${!isSidebarOpen ? 'justify-center p-3' : 'px-3.5 py-3 gap-3'} rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === item.id ? 'bg-primary text-white font-semibold shadow-md shadow-primary/20' : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span className="truncate">{item.sidebarLabel}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 shrink-0">
          <button
            onClick={signOut}
            title={!isSidebarOpen ? 'Encerrar Sessão' : undefined}
            className={`w-full flex items-center ${!isSidebarOpen ? 'justify-center p-2.5' : 'gap-2.5 px-3.5 py-2.5'} rounded-xl text-white/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-xs font-medium cursor-pointer`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {isSidebarOpen && <span>Encerrar Sessão</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-6 md:px-10 flex items-center justify-between sticky top-0 z-40 shadow-xs select-none">
          <h1 className="text-base font-semibold text-navy tracking-tight">{SUPER_ADMIN_HEADER_TITLES[activeTab] || 'Painel de Controle'}</h1>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-bold text-xs shrink-0">{userInitial}</div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-xs font-semibold text-navy truncate max-w-[160px]">{profile?.full_name || 'David Silva (Owner)'}</span>
                <span className="text-[10px] text-slate-500 font-medium truncate max-w-[160px]">Super Administrador</span>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <NotificationDropdown />
            <button onClick={signOut} className="flex items-center justify-center h-8 w-8 bg-rose-50 text-rose-500 rounded-full border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-xs group cursor-pointer" title="Encerrar Sessão">
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 pb-24 lg:pb-12 bg-[#F8FAFC]">
          <div className="space-y-8 animate-in fade-in duration-500">
            {activeTab === 'dashboard' && <PlatformStatsCards stats={statsHook.stats} tenants={tenantsHook.tenants} />}

            {activeTab === 'tenants' && (
              <TenantsManagementView
                tenants={tenantsHook.filteredTenants} searchTerm={tenantsHook.searchTerm} onSearchChange={tenantsHook.setSearchTerm}
                updatingTenantId={tenantsHook.updatingTenantId} onOpenCreate={tenantsHook.openCreateModal} onOpenEdit={tenantsHook.openEditModal}
                onGenerateInvite={tenantsHook.generateAndCopyNewLink} onToggleStatus={tenantsHook.handleToggleTenantStatus} onDeleteTenant={tenantsHook.handleDeleteTenant}
              />
            )}

            {activeTab === 'monitoring' && (
              <TenantAuditView
                tenants={tenantsHook.tenants} selectedTenantId={statsHook.selectedMonitoringTenant} onSelectTenant={statsHook.setSelectedMonitoringTenant}
                paginatedLogs={statsHook.paginatedLogs} totalLogsCount={statsHook.auditLogs.length} loadingLogs={statsHook.loadingLogs}
                currentPage={statsHook.currentPage} totalPages={statsHook.totalAuditPages} onPageChange={statsHook.setCurrentPage}
              />
            )}

            {activeTab === 'users' && (
              <GlobalUsersView
                allUsers={usersHook.allUsers} filteredUsers={usersHook.filteredUsers} tenants={tenantsHook.tenants}
                searchTerm={usersHook.userSearchTerm} onSearchChange={usersHook.setUserSearchTerm}
                selectedTenantId={usersHook.selectedUserTenantId} onSelectTenant={usersHook.setSelectedUserTenantId}
                categoryFilter={usersHook.userCategoryFilter} onCategoryFilterChange={usersHook.setUserCategoryFilter}
                statusFilter={usersHook.userStatusFilter} onStatusFilterChange={usersHook.setUserStatusFilter}
                expandedSections={usersHook.expandedSections} onToggleSection={usersHook.toggleSection}
                updatingUserId={usersHook.updatingUserId} onToggleUserStatus={usersHook.handleToggleUserStatus}
              />
            )}
          </div>
        </main>

        <MobileNav activeSection={activeTab} setActiveSection={(s: string) => setActiveTab(s as SuperAdminTab)} items={navItems.map(({ id, label, icon }) => ({ id, label, icon }))} />
      </div>

      <TenantFormModal
        isOpen={tenantsHook.isModalOpen} editingTenant={tenantsHook.editingTenant} tenants={tenantsHook.tenants} creating={tenantsHook.creating}
        formData={tenantsHook.formData} setFormData={tenantsHook.setFormData} generatedInvite={tenantsHook.generatedInvite} copySuccess={tenantsHook.copySuccess}
        websiteInput={tenantsHook.websiteInput} onWebsiteInputChange={tenantsHook.setWebsiteInput} isExtractingBranding={tenantsHook.isExtractingBranding}
        detectedPalette={tenantsHook.detectedPalette} activeColorSlot={tenantsHook.activeColorSlot} onActiveColorSlotChange={tenantsHook.setActiveColorSlot}
        extractionFeedback={tenantsHook.extractionFeedback} onAutoDetectBranding={tenantsHook.handleAutoDetectBranding}
        onCopyInviteLink={tenantsHook.handleCopyInviteLink} onSubmit={tenantsHook.handleSubmitTenant} onClose={tenantsHook.closeModal}
      />
    </div>
  );
}
