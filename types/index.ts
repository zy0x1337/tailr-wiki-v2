// types/index.ts
export interface PetRatings {
  energielevel?: number
  bewegungsbedarf?: {
    overall?: number
    physicalActivity?: number
    mentalStimulation?: number
    playfulness?: number
    wanderlust?: number
  }
  familienfreundlichkeit?: {
    overall?: number
    children?: number
    family?: number
    freundlichkeitFremde?: number
    socialAdaptation?: number
  }
  trainierbarkeit?: {
    overall?: number
    obedience?: number
    focusSpan?: number
    commandRetention?: number
    adaptability?: number
  }
  anfängertauglichkeit?: number
  wachtrieb?: {
    overall?: number
    watchfulness?: number
    territorialBehavior?: number
    responsiveness?: number
    alertness?: number
  }
  belltendenz?: number
  fellpflegeaufwand?: {
    overall?: number
    haaren?: number
    brushingFrequency?: number
    professionalGrooming?: number
  }
  gesundheitsrobustheit?: {
    overall?: number
    erbkrankheitenRisiko?: number
    geneticHealth?: number
    immuneSystem?: number
    injuryResistance?: number
  }
  temperaturresistenz?: {
    overall?: number
    kälteresistenz?: number
    hitzeresistenz?: number
    weatherResistance?: number
    seasonalAdaptation?: number
  }
  beutetrieb?: {
    overall?: number
    chasing?: number
    hunting?: number
    catCompatibility?: number
    smallAnimalTolerance?: number
  }
  arbeitsfähigkeit?: {
    overall?: number
    taskFocus?: number
    endurance?: number
    problemSolving?: number
    versatility?: number
  }
  unabhängigkeit?: number
  apartmentTauglichkeit?: {
    overall?: number
    spaceRequirements?: number
    noiseTolerance?: number
    neighborCompatibility?: number
  }
}

export interface PetDetails {
  summary?: string
  character?: string
  health?: string
  grooming?: string
  activity?: string
  suitability?: string
}
