# AI Recommendation Flow Visualization

## 📊 System Architecture Diagram

```mermaid
graph TD
    A[User Interaction] --> B{Check-In Today?}
    B -->|Yes| C[Extract Current Mood]
    B -->|No| D[Default: Neutral]
    
    C --> E[Calculate Mood Intensity]
    D --> E
    
    A --> F{Recent Chat Messages?}
    F -->|Yes| G[Analyze Sentiment]
    F -->|No| H[Empty Context]
    
    G --> I[Extract Keywords]
    H --> I
    
    E --> J[Build Recommendation Context]
    I --> J
    
    J --> K[Score All 12 Coping Tools]
    
    K --> L{For Each Tool}
    L --> M[Mood Compatibility: 0-40 pts]
    L --> N[Chat Sentiment: 0-30 pts]
    L --> O[Intensity Match: 0-20 pts]
    L --> P[Duration Preference: 0-10 pts]
    
    M --> Q[Total Score]
    N --> Q
    O --> Q
    P --> Q
    
    Q --> R[Generate Explanation]
    R --> S[Sort by Score DESC]
    S --> T[Display to User]
    
    T --> U{User Selects Tool}
    U --> V[Show Dialog]
    V --> W[User Completes Exercise]
    
    style A fill:#e1f5ff
    style K fill:#fff4e1
    style T fill:#e8f5e9
    style W fill:#f3e5f5
```

## 🔄 Scoring Algorithm Detail

```mermaid
flowchart LR
    A[Coping Tool] --> B{Supports<br/>Current Mood?}
    B -->|Yes| C[+40 pts]
    B -->|Partial| D[+20 pts]
    B -->|No| E[+0 pts]
    
    A --> F{Chat Sentiment?}
    F -->|Crisis| G{Tool Category?}
    F -->|Low Mood| H{Tool Category?}
    F -->|Stress| I{Tool Category?}
    
    G -->|Breathing/Grounding| J[+30 pts]
    G -->|Other| K[+0 pts]
    
    H -->|Reflection/Cognitive| L[+30 pts]
    H -->|Other| M[+0 pts]
    
    I -->|Movement/Grounding| N[+30 pts]
    I -->|Other| O[+0 pts]
    
    A --> P{Mood Intensity?}
    P -->|High 7-10| Q{Tool Intensity?}
    P -->|Medium 4-6| R{Tool Intensity?}
    P -->|Low 1-3| S{Tool Intensity?}
    
    Q -->|High| T[+20 pts]
    Q -->|Medium| U[+10 pts]
    Q -->|Low| V[+0 pts]
    
    R -->|Medium| W[+20 pts]
    R -->|Other| X[+15/10 pts]
    
    S -->|Low| Y[+20 pts]
    S -->|Other| Z[+10 pts]
    
    C --> AA[Final Score]
    D --> AA
    E --> AA
    J --> AA
    K --> AA
    L --> AA
    M --> AA
    N --> AA
    O --> AA
    T --> AA
    U --> AA
    V --> AA
    W --> AA
    X --> AA
    Y --> AA
    Z --> AA
    
    AA --> AB[Generate<br/>Explanation]
    AB --> AC[Return<br/>Recommended Tool]
    
    style AA fill:#ffeb3b
    style AC fill:#4caf50,color:#fff
```

## 💬 Example Scenarios

### Scenario 1: High Anxiety Crisis
```mermaid
sequenceDiagram
    participant User
    participant UI as CopingTools UI
    participant Engine as Recommendation Engine
    participant Data as Local Storage
    
    User->>UI: Opens Coping Tools page
    UI->>Data: Fetch checkIns + chatTags
    Data-->>UI: mood="anxious", chat="panic attack"
    
    UI->>Engine: buildRecommendationContext()
    Engine-->>UI: {currentMood: "anxious", <br/>moodIntensity: 8, <br/>keywords: ["panic"]}
    
    UI->>Engine: getRecommendedCopingTools()
    Engine->>Engine: Score Box Breathing → 90
    Engine->>Engine: Score 5-4-3-2-1 → 85
    Engine->>Engine: Score 4-7-8 → 75
    Engine-->>UI: Sorted recommendations
    
    UI->>User: Display "Box Breathing" first<br/>💡 Suggested because you felt<br/>anxious and mentioned panic
    
    User->>UI: Clicks Box Breathing
    UI->>User: Opens breathing dialog
    User->>User: Completes 4-4-4-4 breathing
```

### Scenario 2: Low Mood with Chat Context
```mermaid
sequenceDiagram
    participant User
    participant UI as CopingTools UI
    participant Engine as Recommendation Engine
    participant Data as Local Storage
    
    User->>UI: Opens Coping Tools page
    UI->>Data: Fetch checkIns + chatTags
    Data-->>UI: mood="sad", chat="hopeless"
    
    UI->>Engine: buildRecommendationContext()
    Engine-->>UI: {currentMood: "sad", <br/>moodIntensity: 6, <br/>keywords: ["hopeless"]}
    
    UI->>Engine: getRecommendedCopingTools()
    Engine->>Engine: Score Self-Compassion → 85
    Engine->>Engine: Score Cognitive Reframing → 80
    Engine->>Engine: Score Gratitude → 70
    Engine-->>UI: Sorted recommendations
    
    UI->>User: Display "Self-Compassion" first<br/>💡 Suggested because you expressed<br/>feelings of sadness
    
    User->>UI: Clicks Self-Compassion
    UI->>User: Opens compassion dialog
    User->>User: Reads affirmations
```

## 🎯 Data Flow Summary

```mermaid
graph LR
    A[User Data] --> B[Check-Ins<br/>mood: anxious<br/>createdAt: today]
    A --> C[Chat Tags<br/>tag: panic<br/>context: overwhelmed]
    
    B --> D[Recommendation<br/>Context]
    C --> D
    
    D --> E[currentMood: anxious<br/>moodIntensity: 8<br/>chatSummary: panic...<br/>keywords: [panic]]
    
    E --> F[Scoring Engine]
    
    F --> G[Tool 1<br/>Score: 90<br/>Reason: ...]
    F --> H[Tool 2<br/>Score: 85<br/>Reason: ...]
    F --> I[Tool 3<br/>Score: 75<br/>Reason: ...]
    
    G --> J[Sorted<br/>Recommendations]
    H --> J
    I --> J
    
    J --> K[UI Display]
    
    style A fill:#e3f2fd
    style D fill:#fff3e0
    style F fill:#fce4ec
    style J fill:#e8f5e9
    style K fill:#f3e5f5
```

## 📊 Clinical Validation Flow

```mermaid
flowchart TD
    A[New Coping Tool Proposed] --> B{Peer-Reviewed<br/>Research?}
    B -->|No| C[Reject]
    B -->|Yes| D{Safe for<br/>Self-Guided Use?}
    
    D -->|No| E[Modify or Reject]
    D -->|Yes| F{Clear<br/>Instructions?}
    
    F -->|No| G[Add Guidance]
    F -->|Yes| H{Non-Stigmatizing<br/>Language?}
    
    H -->|No| I[Revise Content]
    H -->|Yes| J{Appropriate<br/>Metadata?}
    
    J -->|No| K[Define:<br/>- Supported Moods<br/>- Intensity Level<br/>- Duration]
    J -->|Yes| L[Add to Dataset]
    
    G --> F
    I --> H
    K --> J
    
    L --> M[Write Unit Tests]
    M --> N[Add Dialog UI]
    N --> O[Clinical Review]
    O --> P[Deploy]
    
    style A fill:#e1f5ff
    style L fill:#e8f5e9
    style P fill:#c8e6c9,color:#2e7d32
    style C fill:#ffcdd2,color:#c62828
    style E fill:#ffcdd2,color:#c62828
```

---

## 📝 Notes

- All diagrams use Mermaid syntax for version control
- Flow reflects actual code implementation in `copingRecommendation.ts`
- Scoring values match algorithm in `scoreTool()` function
- Clinical validation based on guidelines in `COPING_TOOLS_AI_SYSTEM.md`
