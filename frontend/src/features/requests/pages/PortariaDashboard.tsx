import { ClipboardList, History, Truck } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTenant } from '../../../contexts/TenantContext';
import { WebcamModal } from '../../../components/WebcamModal';
import { MobileNav } from '../components/dashboard/MobileNav';
import { PortariaHistoryView } from '../components/dashboard/PortariaHistoryView';
import { useGatekeeperQueue } from '../hooks/useGatekeeperQueue';
import { useGatekeeperRealtime } from '../hooks/useGatekeeperRealtime';
import { useGatekeeperOperations } from '../hooks/useGatekeeperOperations';
import { GatekeeperHeader } from '../components/portaria/GatekeeperHeader';
import { GatekeeperTabs } from '../components/portaria/GatekeeperTabs';
import { GatekeeperEntryQueue } from '../components/portaria/GatekeeperEntryQueue';
import { GatekeeperExitQueue } from '../components/portaria/GatekeeperExitQueue';
import { GatekeeperInPlantView } from '../components/portaria/GatekeeperInPlantView';
import { GatekeeperDiscrepancyModal } from '../components/portaria/GatekeeperDiscrepancyModal';
import { GatekeeperModals } from '../components/portaria/GatekeeperModals';
import type { MobileSection } from '../components/portaria/types';

const portariaNavItems = [
  { id: 'list', label: 'Fila', icon: <Truck /> },
  { id: 'details', label: 'Operação', icon: <ClipboardList /> },
  { id: 'history', label: 'Histórico', icon: <History /> },
];

export default function PortariaDashboard() {
  const { signOut, profile: userProfile } = useAuth();
  const { tenant } = useTenant();

  const {
    requisicoes, setRequisicoes, filteredReqs, loading,
    searchTerm, setSearchTerm, selecionadoId, setSelecionadoId, selectedReq,
    activeTab, setActiveTab, entrySubFilter, setEntrySubFilter,
    exitSubFilter, setExitSubFilter, mobileSection, setMobileSection,
    auditHistory, isHistoryPageOpen, setIsHistoryPageOpen, loadingHistory,
    selectedCompany, setSelectedCompany, fetchRequisicoes, fetchAuditHistory,
  } = useGatekeeperQueue(userProfile?.tenant_id);

  useGatekeeperRealtime(activeTab, fetchRequisicoes);

  const {
    processing, selectedMaterials, setSelectedMaterials,
    detailMaterial, setDetailMaterial, showDiscrepancyModal, setShowDiscrepancyModal,
    discrepancyReason, setDiscrepancyReason, showSuccessModal, setShowSuccessModal,
    modalConfig, signature, setSignature, photos, setPhotos,
    selectedPhotos, setSelectedPhotos, isCameraOpen, setIsCameraOpen,
    observation, setObservation, handleUpdateGateStatus, handleToggleMaterial,
    handleCapturePhoto, removePhoto, handleConfirmMovement,
    handleCancelEntry, handleNotifyDiscrepancy,
  } = useGatekeeperOperations({
    activeTab, selecionadoId, setSelecionadoId, selectedReq,
    setRequisicoes, setMobileSection, fetchRequisicoes,
  });

  const sharedQueueProps = {
    processing, selectedMaterials, onToggleMaterial: handleToggleMaterial,
    onSetSelectedMaterials: setSelectedMaterials, photos,
    onOpenCamera: () => setIsCameraOpen(true), onCapturePhoto: handleCapturePhoto,
    onRemovePhoto: removePhoto, observation, onObservationChange: setObservation,
    signature, onSignatureChange: setSignature, onUpdateGateStatus: handleUpdateGateStatus,
    onConfirmMovement: handleConfirmMovement,
    onOpenDiscrepancyModal: () => setShowDiscrepancyModal(true),
    onBackToList: () => setMobileSection('list'),
    onSelectCompany: setSelectedCompany, onViewPhotos: setSelectedPhotos,
    onSelectMaterialDetail: setDetailMaterial,
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-brand antialiased text-navy selection:bg-primary/10">
      <GatekeeperHeader
        tenant={tenant}
        userProfile={userProfile}
        isHistoryPageOpen={isHistoryPageOpen}
        onToggleHistory={() => {
          const nextState = !isHistoryPageOpen;
          setIsHistoryPageOpen(nextState);
          if (nextState && userProfile?.tenant_id) fetchAuditHistory(userProfile.tenant_id);
        }}
        onSignOut={signOut}
      />

      <main className="max-w-[1700px] mx-auto p-4 md:p-8 pb-36 lg:pb-12">
        {isHistoryPageOpen ? (
          <PortariaHistoryView
            history={auditHistory}
            loading={loadingHistory}
            onRefresh={() => fetchAuditHistory(userProfile?.tenant_id)}
            onBack={() => { setIsHistoryPageOpen(false); setMobileSection('list'); }}
            onViewPhotos={(p) => setSelectedPhotos(p)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <GatekeeperTabs
              activeTab={activeTab}
              onSelectTab={(tab) => { setActiveTab(tab); setMobileSection('list'); }}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              entrySubFilter={entrySubFilter}
              onEntrySubFilterChange={setEntrySubFilter}
              exitSubFilter={exitSubFilter}
              onExitSubFilterChange={setExitSubFilter}
              requisicoes={requisicoes}
              filteredReqs={filteredReqs}
              loading={loading}
              selecionadoId={selecionadoId}
              onSelectRequest={(id) => { setSelecionadoId(id); setMobileSection('details'); }}
              hiddenOnMobile={mobileSection !== 'list'}
            />

            <div className={`lg:col-span-8 ${mobileSection !== 'details' ? 'hidden lg:block' : ''}`}>
              {selectedReq ? (
                activeTab === 'ENTRY' ? (
                  <GatekeeperEntryQueue selectedReq={selectedReq} onCancelEntry={handleCancelEntry} {...sharedQueueProps} />
                ) : activeTab === 'EXIT' ? (
                  <GatekeeperExitQueue selectedReq={selectedReq} {...sharedQueueProps} />
                ) : (
                  <GatekeeperInPlantView
                    selectedReq={selectedReq}
                    onBackToList={() => setMobileSection('list')}
                    onSelectCompany={setSelectedCompany}
                    onViewPhotos={setSelectedPhotos}
                    onSelectMaterialDetail={setDetailMaterial}
                  />
                )
              ) : (
                <div className="h-[550px] flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 relative overflow-hidden">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                    <Truck className="w-8 h-8" />
                  </div>
                  <h3 className="text-slate-800 font-bold text-lg mb-1">Central de Conferência</h3>
                  <p className="text-slate-500 text-xs max-w-sm text-center leading-relaxed">
                    Selecione um veículo na fila lateral para {activeTab === 'IN_PLANTA' ? 'visualizar a operação' : `iniciar o protocolo de ${activeTab === 'ENTRY' ? 'entrada' : 'saída'}`}.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <GatekeeperDiscrepancyModal
        isOpen={showDiscrepancyModal}
        discrepancyReason={discrepancyReason}
        processing={processing}
        onReasonChange={setDiscrepancyReason}
        onClose={() => setShowDiscrepancyModal(false)}
        onConfirm={handleNotifyDiscrepancy}
      />

      <GatekeeperModals
        detailMaterial={detailMaterial}
        onCloseMaterialDetail={() => setDetailMaterial(null)}
        selectedCompany={selectedCompany}
        onCloseCompany={() => setSelectedCompany(null)}
        auditHistory={auditHistory}
        showSuccessModal={showSuccessModal}
        modalConfig={modalConfig}
        onCloseSuccessModal={() => setShowSuccessModal(false)}
        selectedPhotos={selectedPhotos}
        onSelectPhotos={setSelectedPhotos}
      />

      {isCameraOpen && (
        <WebcamModal
          onClose={() => setIsCameraOpen(false)}
          onCapture={(imageSrc) => { setPhotos((prev) => [...prev, imageSrc]); setIsCameraOpen(false); }}
        />
      )}

      <MobileNav
        activeSection={isHistoryPageOpen ? 'history' : mobileSection}
        setActiveSection={(s: string) => {
          if (s === 'history') {
            setIsHistoryPageOpen(true);
            if (userProfile?.tenant_id) fetchAuditHistory(userProfile.tenant_id);
          } else {
            setIsHistoryPageOpen(false);
            setMobileSection(s as MobileSection);
          }
        }}
        items={portariaNavItems}
      />
    </div>
  );
}
