// Tipo para AttackForm (donde date es un Date)
export interface AttackFormType {
    type: string;
  intensity: string;
  invalidating: string;
  medication: string;
  menstruation: string;
  duration: string;
  date: Date;
  }
  
  // Tipo para AttackList (donde date es un string, posiblemente ISO)
  export interface AttackListType {
    _id?: string;
    date: string;
    type: string;
    intensity: string;
    duration?: string;
    medication?: string;
    invalidating?: string;
    menstruation?: string;
  }
  