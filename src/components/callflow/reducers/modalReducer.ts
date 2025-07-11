/**
 * Modal state reducer for consolidated modal management
 * Reduces 8+ boolean states into a single state object
 */

export type ModalType = 
  | 'calendar' 
  | 'followUp' 
  | 'resources' 
  | 'crm' 
  | 'outcome' 
  | 'success' 
  | 'noGo' 
  | 'library';

export interface ModalState {
  calendar: boolean;
  followUp: boolean;
  resources: boolean;
  crm: boolean;
  outcome: boolean;
  success: boolean;
  noGo: boolean;
  library: boolean;
}

export const initialModalState: ModalState = {
  calendar: false,
  followUp: false,
  resources: false,
  crm: false,
  outcome: false,
  success: false,
  noGo: false,
  library: false
};

export type ModalAction = 
  | { type: 'SHOW_MODAL'; modalType: ModalType }
  | { type: 'HIDE_MODAL'; modalType: ModalType }
  | { type: 'HIDE_ALL_MODALS' };

export const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case 'SHOW_MODAL':
      // Hide all other modals when showing a new one
      return {
        ...initialModalState,
        [action.modalType]: true
      };
      
    case 'HIDE_MODAL':
      return {
        ...state,
        [action.modalType]: false
      };
      
    case 'HIDE_ALL_MODALS':
      return initialModalState;
      
    default:
      return state;
  }
};