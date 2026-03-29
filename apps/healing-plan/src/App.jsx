import { useState, useRef } from "react";
import {
  HEALING_PLAN_ASSESSMENT_AREAS,
  HEALING_PLAN_BARRIER_ROWS,
  HEALING_PLAN_SECTIONS,
} from "../../../packages/assessment-core/src/healingPlan.js";
import { buildHealingPlanExportText } from "../../../packages/exports/src/healingPlan.js";

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%",
        padding: "10px 12px",
        lineHeight: "1.6",
        resize: "vertical",
      }}
    />
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <div className="field-row" style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
      <label style={{ fontSize: "14px", color: "var(--color-text-secondary)", minWidth: "140px", flexShrink: 0 }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function Prompt({ children }) {
  return (
    <p style={{ fontSize: "13px", color: "var(--purple-light)", fontStyle: "italic", margin: "4px 0 10px", lineHeight: "1.5" }}>
      {children}
    </p>
  );
}

function SectionHeader({ children }) {
  return (
    <div style={{
      background: "var(--purple-mid)",
      color: "#fff",
      padding: "10px 16px",
      borderRadius: "var(--border-radius-md)",
      fontSize: "15px",
      fontWeight: 500,
      marginBottom: "16px",
      marginTop: "8px",
    }}>
      {children}
    </div>
  );
}

function SubHeader({ children }) {
  return (
    <h3 style={{ fontSize: "15px", fontWeight: 500, color: "var(--color-text-primary)", margin: "20px 0 6px" }}>
      {children}
    </h3>
  );
}

function GoldBar({ children }) {
  return (
    <div style={{
      background: "var(--gold-bg)",
      color: "var(--gold-dark)",
      padding: "10px 16px",
      borderRadius: "var(--border-radius-md)",
      fontSize: "15px",
      fontWeight: 500,
      marginBottom: "16px",
      marginTop: "8px",
    }}>
      {children}
    </div>
  );
}

function RatingRow({ area, rating, priority, onRating, onPriority }) {
  return (
    <div className="rating-row" style={{
      display: "grid",
      gridTemplateColumns: "1fr 200px 80px",
      gap: "8px",
      alignItems: "center",
      padding: "10px 12px",
      borderBottom: "0.5px solid var(--color-border-tertiary)",
      fontSize: "13px",
    }}>
      <span style={{ color: "var(--color-text-primary)", lineHeight: "1.4" }}>{area}</span>
      <div className="rating-buttons" style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => onRating(n)}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: rating === n ? "2px solid var(--purple-mid)" : "0.5px solid var(--color-border-secondary)",
              background: rating === n ? "var(--purple-bg)" : "var(--color-background-primary)",
              color: rating === n ? "var(--purple-mid)" : "var(--color-text-secondary)",
              fontSize: "13px",
              fontWeight: rating === n ? 500 : 400,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <select
        value={priority}
        onChange={e => onPriority(e.target.value)}
        style={{ padding: "4px 6px", fontSize: "12px" }}
      >
        <option value="">—</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
  );
}

function ActionBlock({ number, title, prompt: promptText, fields, data, onChange }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <SubHeader>{number}. {title}</SubHeader>
      {promptText && <Prompt>{promptText}</Prompt>}
      {fields.map(f => (
        <TextField
          key={f.key}
          label={f.label}
          value={data[f.key] || ""}
          onChange={v => onChange(f.key, v)}
          placeholder={f.placeholder}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("start");
  const [d, setD] = useState({});
  const [assessments, setAssessments] = useState({});
  const contentRef = useRef(null);

  const set = (key, val) => setD(prev => ({ ...prev, [key]: val }));
  const setAssess = (areaKey, field, val) => {
    setAssessments(prev => ({
      ...prev,
      [areaKey]: { ...prev[areaKey], [field]: val }
    }));
  };

  const goTo = (id) => {
    setActive(id);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  };

  const currentIdx = HEALING_PLAN_SECTIONS.findIndex(s => s.id === active);

  const exportPlan = () => {
    const text = buildHealingPlanExportText(d, assessments);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Healing_Centered_Action_Plan.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      background: "var(--color-background-primary)",
      borderRadius: "var(--border-radius-lg)",
      border: "0.5px solid var(--color-border-tertiary)",
      overflow: "hidden",
    }}>
      <div className="plan-layout" style={{ display: "flex", gap: "0", minHeight: "600px" }}>
        {/* Navigation */}
        <nav className="plan-nav" style={{
          width: "180px",
          flexShrink: 0,
          borderRight: "0.5px solid var(--color-border-tertiary)",
          padding: "16px 0",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}>
          <div className="nav-brand" style={{ padding: "0 12px 14px", borderBottom: "0.5px solid var(--color-border-tertiary)", marginBottom: "8px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, color: "var(--purple-mid)", margin: "0 0 2px", letterSpacing: "0.05em", textTransform: "uppercase" }}>TKB Strategies</p>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-primary)", margin: 0, lineHeight: "1.3" }}>Healing-centered action plan</p>
          </div>
          {HEALING_PLAN_SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => goTo(s.id)}
              style={{
                display: "block",
                width: "auto",
                textAlign: "left",
                padding: "8px 12px",
                border: "none",
                background: active === s.id ? "var(--purple-bg)" : "transparent",
                color: active === s.id ? "var(--purple-mid)" : "var(--color-text-secondary)",
                fontWeight: active === s.id ? 500 : 400,
                fontSize: "13px",
                borderRadius: "var(--border-radius-md)",
                margin: "0 4px",
                lineHeight: "1.4",
              }}
            >
              {s.label}
            </button>
          ))}
          <div className="nav-export" style={{ marginTop: "auto", padding: "12px" }}>
            <button onClick={exportPlan} style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: "13px",
              background: "var(--purple-mid)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--border-radius-md)",
              fontWeight: 500,
            }}>
              Export plan
            </button>
          </div>
        </nav>

        {/* Content */}
        <div ref={contentRef} className="plan-content" style={{ flex: 1, padding: "20px 28px", overflowY: "auto", maxHeight: "700px" }}>

          {active === "start" && (
            <div>
              <SectionHeader>Organization information</SectionHeader>
              <TextField label="Organization name" value={d.orgName || ""} onChange={v => set("orgName", v)} />
              <TextField label="Planning team" value={d.planTeam || ""} onChange={v => set("planTeam", v)} />
              <TextField label="Date completed" value={d.dateCompleted || ""} onChange={v => set("dateCompleted", v)} />
              <TextField label="Facilitator / coach" value={d.facilitator || ""} onChange={v => set("facilitator", v)} />

              <SectionHeader>Your starting place</SectionHeader>
              <Prompt>Where is your organization on the journey from trauma-informed to healing-centered? What does your current practice look like — in how you support young people, staff, and community?</Prompt>
              <TextArea value={d.startReflect || ""} onChange={v => set("startReflect", v)} rows={4} placeholder="Name what is real for your organization right now..." />

              <SubHeader>What brought you to this session today?</SubHeader>
              <Prompt>What is calling your attention — a challenge, a hope, a readiness for something different?</Prompt>
              <TextArea value={d.startWhy || ""} onChange={v => set("startWhy", v)} rows={3} />
            </div>
          )}

          {active === "assess" && (
            <div>
              <SectionHeader>Organizational healing assessment</SectionHeader>
              <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.5", margin: "0 0 6px" }}>
                Rate your organization's current practice in each area (1 = not yet explored, 5 = deeply integrated). Then mark your priority level.
              </p>
              <Prompt>This is not a score to achieve — it is an honest mirror. Healing-centered work begins with naming what is real.</Prompt>

              <div className="rating-grid rating-header" style={{
                display: "grid",
                gridTemplateColumns: "1fr 200px 80px",
                gap: "8px",
                padding: "8px 12px",
                background: "var(--purple-mid)",
                color: "#fff",
                borderRadius: "var(--border-radius-md) var(--border-radius-md) 0 0",
                fontSize: "12px",
                fontWeight: 500,
              }}>
                <span>Assessment area</span>
                <span style={{ textAlign: "center" }}>Rating (1–5)</span>
                <span>Priority</span>
              </div>
              {HEALING_PLAN_ASSESSMENT_AREAS.map(a => (
                <RatingRow
                  key={a.key}
                  area={a.label}
                  rating={(assessments[a.key] || {}).rating}
                  priority={(assessments[a.key] || {}).priority || ""}
                  onRating={v => setAssess(a.key, "rating", v)}
                  onPriority={v => setAssess(a.key, "priority", v)}
                />
              ))}

              <SubHeader>What patterns do you notice?</SubHeader>
              <Prompt>Where are your strengths as an organization? Where are the gaps between intention and practice?</Prompt>
              <TextArea value={d.assessPatterns || ""} onChange={v => set("assessPatterns", v)} rows={4} />
            </div>
          )}

          {active === "day30" && (
            <div>
              <SectionHeader>30-day actions — naming & beginning</SectionHeader>
              <Prompt>The first 30 days are about sharing what you've learned, assessing where you are, and choosing one policy to examine. Start small. Start with honesty. Start together.</Prompt>

              <ActionBlock
                number={1} title="Share learning with your team"
                prompt="How will you bring what you experienced today back to your organization? Who needs to be in the room?"
                fields={[
                  { key: "d30_share_Action", label: "Action" },
                  { key: "d30_share_Person", label: "Person responsible" },
                  { key: "d30_share_ByWhen", label: "By when" },
                  { key: "d30_share_HowKnow", label: "How you'll know" },
                ]}
                data={d} onChange={(k, v) => set(k, v)}
              />
              <ActionBlock
                number={2} title="Conduct an honest organizational assessment"
                prompt="Consider using the assessment on the previous page with your leadership team. What would it mean to let staff and young people also rate these areas?"
                fields={[
                  { key: "d30_assess_Action", label: "Action" },
                  { key: "d30_assess_Person", label: "Who will participate" },
                  { key: "d30_assess_ByWhen", label: "By when" },
                  { key: "d30_assess_HowKnow", label: "How you'll know" },
                ]}
                data={d} onChange={(k, v) => set(k, v)}
              />
              <ActionBlock
                number={3} title="Choose one policy to review through a healing lens"
                prompt="Examples: crisis response protocols, hiring practices, meeting structures, leave/PTO, performance reviews. Ask: Does this policy build trust, or replicate dynamics of control?"
                fields={[
                  { key: "d30_policy_Action", label: "Policy to review" },
                  { key: "d30_policy_Person", label: "Person responsible" },
                  { key: "d30_policy_ByWhen", label: "By when" },
                  { key: "d30_policy_HowKnow", label: "How you'll know" },
                ]}
                data={d} onChange={(k, v) => set(k, v)}
              />

              <SubHeader>30-day reflection</SubHeader>
              <Prompt>What would it look like for your organization to move from asking "What happened to you?" toward asking "What's right with you?" — in a staff meeting, a policy, a daily interaction?</Prompt>
              <TextArea value={d.d30_reflect || ""} onChange={v => set("d30_reflect", v)} rows={3} />
            </div>
          )}

          {active === "day60" && (
            <div>
              <SectionHeader>60-day actions — building the container</SectionHeader>
              <Prompt>At 60 days, you are building the relational and structural foundation. This is where collective commitment takes shape — through teams, training, and the centering of lived experience.</Prompt>

              <ActionBlock
                number={1} title="Form a healing-centered implementation team"
                prompt="This team should reflect the diversity of your organization — including people who hold positional power and people closest to the work. Consider including a young person or program participant."
                fields={[
                  { key: "d60_team_Members", label: "Team members" },
                  { key: "d60_team_Cadence", label: "Meeting cadence" },
                ]}
                data={d} onChange={(k, v) => set(k, v)}
              />
              <Prompt>What is this team's authority? What decisions can it make?</Prompt>
              <TextArea value={d.d60_team_Charter || ""} onChange={v => set("d60_team_Charter", v)} rows={3} placeholder="Team purpose and charter..." />

              <ActionBlock
                number={2} title="Initiate staff training — tiered by role"
                prompt="Tiered model: Foundational (all staff, annual), Practice-specific (direct service, quarterly), Leadership (supervisors, bi-monthly), Advanced clinical (therapists, monthly)."
                fields={[
                  { key: "d60_training_Topic", label: "Training topic" },
                  { key: "d60_training_Audience", label: "Target audience" },
                  { key: "d60_training_Method", label: "Delivery method" },
                  { key: "d60_training_Eval", label: "How you'll evaluate" },
                ]}
                data={d} onChange={(k, v) => set(k, v)}
              />

              <ActionBlock
                number={3} title="Create a feedback pathway for young people"
                prompt="Methods for authentic participation: anonymous channels, youth-led evaluations, reverse mentoring, compensated consulting roles, representation in strategic planning."
                fields={[
                  { key: "d60_feedback_Method", label: "Method selected" },
                  { key: "d60_feedback_Acting", label: "Plan for acting on input" },
                ]}
                data={d} onChange={(k, v) => set(k, v)}
              />
              <Prompt>What do young people most need to be asked? What would shift if they felt truly heard?</Prompt>
              <TextArea value={d.d60_feedback_Questions || ""} onChange={v => set("d60_feedback_Questions", v)} rows={2} placeholder="Key questions to ask..." />

              <SubHeader>60-day reflection</SubHeader>
              <Prompt>What does it mean to "build care into organizational structure and budget" rather than asking individuals to take care of themselves? Where is your organization on this shift?</Prompt>
              <TextArea value={d.d60_reflect || ""} onChange={v => set("d60_reflect", v)} rows={3} />
            </div>
          )}

          {active === "day90" && (
            <div>
              <SectionHeader>90-day actions — shifting systems</SectionHeader>
              <Prompt>At 90 days, healing becomes embedded — in how policies are written, how people are supported, and how power is shared with young people.</Prompt>

              <ActionBlock
                number={1} title="Revise policies through a healing-centered lens"
                prompt="Key areas: crisis response (restoration over punishment), hiring (inclusive, skills-based), meetings (check-ins, content warnings, break options), performance (growth-oriented), leave/PTO (flexible, mental health affirming)."
                fields={[
                  { key: "d90_policy_Policies", label: "Policies to update" },
                  { key: "d90_policy_Process", label: "Revision process" },
                  { key: "d90_policy_Training", label: "Staff training needed" },
                ]}
                data={d} onChange={(k, v) => set(k, v)}
              />

              <ActionBlock
                number={2} title="Implement staff support & collective care structures"
                prompt="Move beyond individual self-care toward organizational responsibility: trauma exposure assessments, rotation of high-intensity roles, scheduled debriefs, proactive time-off. Watch for: emotional exhaustion, cynicism, reduced accomplishment."
                fields={[
                  { key: "d90_support_Structures", label: "Support structures" },
                  { key: "d90_support_Resources", label: "Resources required" },
                  { key: "d90_support_Timeline", label: "Rollout timeline" },
                  { key: "d90_support_Indicators", label: "Success indicators" },
                ]}
                data={d} onChange={(k, v) => set(k, v)}
              />

              <ActionBlock
                number={3} title="Develop youth leadership & power-sharing structures"
                prompt="Models: paid youth advisory boards with decision authority, youth on organizational boards, youth co-facilitating staff trainings, participation in hiring, youth-led committees with dedicated budgets, graduated leadership pipelines."
                fields={[
                  { key: "d90_youth_Model", label: "Model selected" },
                  { key: "d90_youth_Recruit", label: "Recruitment strategy" },
                  { key: "d90_youth_Onboard", label: "Training / onboarding" },
                  { key: "d90_youth_Decisions", label: "Decision areas" },
                ]}
                data={d} onChange={(k, v) => set(k, v)}
              />

              <SubHeader>90-day reflection</SubHeader>
              <Prompt>Healing-centered work is future-focused. What is the organization you are becoming? What will young people and staff experience differently 90 days from now?</Prompt>
              <TextArea value={d.d90_reflect || ""} onChange={v => set("d90_reflect", v)} rows={3} />
            </div>
          )}

          {active === "barriers" && (
            <div>
              <SectionHeader>Navigating barriers with compassionate agility</SectionHeader>
              <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.5", margin: "0 0 16px" }}>
                Name your barriers honestly — then imagine solutions rooted in the same healing principles you are building into your culture.
              </p>

              {HEALING_PLAN_BARRIER_ROWS.map((b, i) => (
                <div key={i} style={{
                  padding: "12px 0",
                  borderBottom: "0.5px solid var(--color-border-tertiary)",
                }}>
                  <p style={{ fontSize: "14px", fontWeight: 500, margin: "0 0 4px", color: "var(--color-text-primary)" }}>{b.challenge}</p>
                  <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", margin: "0 0 8px", fontStyle: "italic" }}>{b.hint}</p>
                  <TextArea value={d[`barrier_${i}`] || ""} onChange={v => set(`barrier_${i}`, v)} rows={2} placeholder="Your plan..." />
                </div>
              ))}

              <SubHeader>Additional barriers unique to your organization</SubHeader>
              <TextArea value={d.addlBarriers || ""} onChange={v => set("addlBarriers", v)} rows={3} />

              <GoldBar>Resources & evaluation</GoldBar>
              <SubHeader>Current assets</SubHeader>
              <Prompt>What strengths, relationships, funding, and knowledge already exist that can support this work?</Prompt>
              <TextArea value={d.assets || ""} onChange={v => set("assets", v)} rows={3} />

              <SubHeader>Resource gaps</SubHeader>
              <Prompt>What do you need that you don't yet have — training, funding, staffing, external support?</Prompt>
              <TextArea value={d.gaps || ""} onChange={v => set("gaps", v)} rows={3} />

              <SubHeader>How you will know it's working</SubHeader>
              <Prompt>What will be different — in culture, in retention, in the experience of young people and staff?</Prompt>
              <TextArea value={d.howKnow || ""} onChange={v => set("howKnow", v)} rows={3} />

              <TextField label="Review timeline" value={d.reviewTimeline || ""} onChange={v => set("reviewTimeline", v)} />

              <GoldBar>Sustainability & integration</GoldBar>
              <TextField label="Budget implications" value={d.budget || ""} onChange={v => set("budget", v)} />

              <SubHeader>Staff capacity building</SubHeader>
              <Prompt>How will you build internal expertise so this work lives beyond any one person?</Prompt>
              <TextArea value={d.capacity || ""} onChange={v => set("capacity", v)} rows={2} />

              <SubHeader>Knowledge transfer strategy</SubHeader>
              <Prompt>How will you onboard new staff into this culture? How will learning be documented and shared?</Prompt>
              <TextArea value={d.knowledge || ""} onChange={v => set("knowledge", v)} rows={2} />

              <SubHeader>Integration with strategic plan</SubHeader>
              <Prompt>Where does healing-centered practice show up in your strategic priorities, board agenda, and annual goals?</Prompt>
              <TextArea value={d.strategic || ""} onChange={v => set("strategic", v)} rows={2} />
            </div>
          )}

          {active === "commit" && (
            <div>
              <GoldBar>Commitment statement</GoldBar>
              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "var(--color-text-primary)", margin: "0 0 20px" }}>
                We commit to building a healing-centered organization — one where the care modeled for staff mirrors the care extended to the people we serve. We recognize this is a journey that requires sustained attention, honest reflection, shared power, and deep investment in the wellbeing of every person in our community. We move forward together.
              </p>

              <SubHeader>Your commitment — in your own words</SubHeader>
              <Prompt>What are you personally committing to? What is your organization ready to name?</Prompt>
              <TextArea value={d.commitment || ""} onChange={v => set("commitment", v)} rows={5} placeholder="Write your commitment here..." />

              <div style={{ marginTop: "28px" }}>
                {["Executive director / leader", "Board chair / governance lead", "Young person / participant representative"].map((role, i) => (
                  <div key={i} style={{ marginBottom: "20px" }}>
                    <div style={{ borderBottom: "0.5px solid var(--color-border-secondary)", marginBottom: "6px", paddingBottom: "4px" }}>
                      <TextField label={role} value={d[`sig_${i}`] || ""} onChange={v => set(`sig_${i}`, v)} placeholder="Name" />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: "32px",
                padding: "16px",
                borderTop: "0.5px solid var(--color-border-tertiary)",
                textAlign: "center",
              }}>
                <p style={{ fontSize: "14px", fontStyle: "italic", color: "var(--purple-mid)", margin: "0 0 8px" }}>
                  "Today we name our experience and share our collective wisdom."
                </p>
                <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", margin: 0 }}>
                  TKB Strategies | tkbstrategies.com
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px", paddingTop: "16px", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
            <button
              onClick={() => currentIdx > 0 && goTo(HEALING_PLAN_SECTIONS[currentIdx - 1].id)}
              disabled={currentIdx === 0}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                background: "transparent",
                border: "0.5px solid var(--color-border-secondary)",
                borderRadius: "var(--border-radius-md)",
                color: "var(--color-text-secondary)",
                opacity: currentIdx === 0 ? 0.3 : 1,
                cursor: currentIdx === 0 ? "default" : "pointer",
              }}
            >
              Previous
            </button>
            <button
              onClick={() => currentIdx < HEALING_PLAN_SECTIONS.length - 1 && goTo(HEALING_PLAN_SECTIONS[currentIdx + 1].id)}
              disabled={currentIdx === HEALING_PLAN_SECTIONS.length - 1}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                background: currentIdx === HEALING_PLAN_SECTIONS.length - 1 ? "transparent" : "var(--purple-mid)",
                color: currentIdx === HEALING_PLAN_SECTIONS.length - 1 ? "var(--color-text-secondary)" : "#fff",
                border: currentIdx === HEALING_PLAN_SECTIONS.length - 1 ? "0.5px solid var(--color-border-secondary)" : "none",
                borderRadius: "var(--border-radius-md)",
                cursor: currentIdx === HEALING_PLAN_SECTIONS.length - 1 ? "default" : "pointer",
                opacity: currentIdx === HEALING_PLAN_SECTIONS.length - 1 ? 0.3 : 1,
                fontWeight: 500,
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
