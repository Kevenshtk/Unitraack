import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { LiderSidebar } from '../components/dashboard/LiderSidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { MobileNav } from '../components/dashboard/MobileNav';
import { AcceptModal } from '../components/dashboard/AcceptModal';
import { TransferModal } from '../components/dashboard/TransferModal';
import { ExitModal } from '../components/dashboard/ExitModal';
import { LayoutDashboard, Package as PackageIcon, History as HistoryIcon } from 'lucide-react';

import { useLeaderOperations } from '../hooks/useLeaderOperations';
import { useLeaderRealtime } from '../hooks/useLeaderRealtime';
import { LeaderApprovalsView } from '../components/lider/LeaderApprovalsView';
import { LeaderSectorInventoryView } from '../components/lider/LeaderSectorInventoryView';
import { LeaderMovementsView } from '../components/lider/LeaderMovementsView';
import { LeaderHistoryView } from '../components/lider/LeaderHistoryView';
import { LeaderRejectReasonModal } from '../components/lider/LeaderRejectReasonModal';
import { LeaderModals } from '../components/lider/LeaderModals';

export default function LiderDashboard() {
  const { profile } = useAuth();
  const [activeSection, setActiveSection] = useState('approvals');
  const ops = useLeaderOperations();

  useLeaderRealtime({
    onMaterialsChange: ops.fetchSectorMaterials,
    onMovementsChange: ops.fetchMovements,
    onRequestsChange: ops.fetchPendencias
  });

  const navItems = [
    { id: 'approvals', label: 'Aprovações', icon: <LayoutDashboard /> },
    { id: 'my-sector', label: 'Meu Setor', icon: <PackageIcon /> },
    { id: 'movements', label: 'Histórico', icon: <HistoryIcon /> },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-brand overflow-hidden">
      <LiderSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userName={profile?.full_name}
        userRole={profile?.role}
        sectorName={ops.liderInfo?.sector || profile?.sector}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <DashboardHeader section={activeSection} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-industrial-grid pb-24 md:pb-10">
          {activeSection === 'approvals' && (
            <LeaderApprovalsView
              requisicoes={ops.requisicoes}
              loading={ops.loading}
              onApprove={ops.handleApprove}
              onOpenRejectModal={ops.setRejectModalTargetId}
              onSelectCompany={ops.setSelectedCompany}
              onSelectMaterial={ops.setSelectedMaterial}
            />
          )}

          {activeSection === 'my-sector' && (
            <LeaderSectorInventoryView
              materials={ops.filteredMaterials}
              searchTerm={ops.searchTerm}
              onSearchChange={ops.setSearchTerm}
              selectedForTransfer={ops.selectedForTransfer}
              onToggleSelectMaterial={ops.toggleSelectMaterial}
              onClearSelection={() => ops.setSelectedForTransfer([])}
              onOpenTransferModal={() => ops.setIsTransferModalOpen(true)}
              onOpenExitModal={() => ops.setIsExitModalOpen(true)}
              onAcceptClick={ops.handleAcceptClick}
              onRejectTransferClick={ops.handleRejectTransferClick}
              onCancelTransferClick={ops.handleCancelTransferClick}
              onSelectMaterial={ops.setSelectedMaterial}
              onViewPhotos={ops.setSelectedPhotos}
              currentSectorId={ops.liderInfo?.sector_id || profile?.sector_id}
              loading={ops.loading}
            />
          )}

          {activeSection === 'transfers' && (
            <LeaderMovementsView
              materials={ops.sectorMaterials}
              currentSectorId={ops.liderInfo?.sector_id || profile?.sector_id}
              currentSectorName={ops.liderInfo?.sector || profile?.sector}
              isProcessing={ops.isProcessing}
              onAcceptClick={ops.handleAcceptClick}
              onRejectTransferClick={ops.handleRejectTransferClick}
              onCancelTransferClick={ops.handleCancelTransferClick}
              onSelectMaterial={ops.setSelectedMaterial}
              onViewPhotos={ops.setSelectedPhotos}
            />
          )}

          {activeSection === 'movements' && (
            <LeaderHistoryView
              paginatedMovements={ops.paginatedMovements}
              totalFilteredCount={ops.totalFilteredMovementsCount}
              movementSearch={ops.movementSearch}
              onMovementSearchChange={ops.setMovementSearch}
              movementDate={ops.movementDate}
              onMovementDateChange={ops.setMovementDate}
              movementFilterType={ops.movementFilterType}
              onMovementFilterTypeChange={ops.setMovementFilterType}
              currentPage={ops.movementPage}
              totalPages={ops.totalMovementPages}
              onPageChange={ops.setMovementPage}
              onRefresh={ops.fetchMovements}
              sectorName={ops.liderInfo?.sector || profile?.sector}
              dateFilteredCount={ops.dateFilteredCount}
              inCount={ops.inCount}
              outCount={ops.outCount}
              onViewPhotos={ops.setSelectedPhotos}
              loading={ops.loading}
            />
          )}
        </main>
      </div>

      {ops.isTransferModalOpen && (
        <TransferModal
          materialIds={ops.selectedForTransfer}
          onClose={() => ops.setIsTransferModalOpen(false)}
          onConfirm={ops.handleTransfer}
          isProcessing={ops.isProcessing}
          currentSectorId={ops.liderInfo?.sector_id || profile?.sector_id || ops.sectorMaterials.find(m => ops.selectedForTransfer.includes(m.id))?.current_sector_id}
          currentSectorName={ops.liderInfo?.sector || profile?.sector}
        />
      )}

      {ops.isExitModalOpen && (
        <ExitModal
          materialIds={ops.selectedForTransfer}
          onClose={() => ops.setIsExitModalOpen(false)}
          onConfirm={ops.handleMarkExit}
          isProcessing={ops.isProcessing}
        />
      )}

      {ops.isAcceptModalOpen && ops.itemToAccept && (
        <AcceptModal
          materialName={ops.itemToAccept.name}
          onClose={() => ops.setIsAcceptModalOpen(false)}
          onConfirm={ops.handleAcceptConfirm}
          isProcessing={ops.isProcessing}
        />
      )}

      <LeaderRejectReasonModal
        isOpen={Boolean(ops.rejectModalTargetId)}
        targetId={ops.rejectModalTargetId}
        isProcessing={ops.isProcessing}
        onClose={() => ops.setRejectModalTargetId(null)}
        onConfirmReject={(id, reason) => ops.handleReject(id, reason)}
      />

      <LeaderModals
        selectedCompany={ops.selectedCompany}
        onCloseCompany={() => ops.setSelectedCompany(null)}
        selectedMaterial={ops.selectedMaterial}
        onCloseMaterial={() => ops.setSelectedMaterial(null)}
        selectedPhotos={ops.selectedPhotos}
        onClosePhotos={() => ops.setSelectedPhotos(null)}
        onViewPhotos={ops.setSelectedPhotos}
      />

      <MobileNav
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        items={navItems}
      />
    </div>
  );
}
