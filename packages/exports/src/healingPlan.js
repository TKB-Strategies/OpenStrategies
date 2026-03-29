import {
  HEALING_PLAN_ASSESSMENT_AREAS,
  HEALING_PLAN_BARRIER_ROWS,
} from "../../assessment-core/src/healingPlan.js";

function valueOf(data, key) {
  return data[key] || "";
}

export function buildHealingPlanExportText(data, assessments) {
  let text = "HEALING-CENTERED LEADERSHIP ACTION PLAN\nTKB Strategies\n";
  text += "=".repeat(50) + "\n\n";
  text += `Organization: ${valueOf(data, "orgName")}\nPlanning Team: ${valueOf(data, "planTeam")}\nDate: ${valueOf(data, "dateCompleted")}\nFacilitator: ${valueOf(data, "facilitator")}\n\n`;
  text += "STARTING PLACE\n" + "-".repeat(30) + "\n";
  text += `Reflection: ${valueOf(data, "startReflect")}\nWhat brought you: ${valueOf(data, "startWhy")}\n\n`;
  text += "ASSESSMENT\n" + "-".repeat(30) + "\n";
  HEALING_PLAN_ASSESSMENT_AREAS.forEach((area) => {
    const result = assessments[area.key] || {};
    text += `${area.label}\n  Rating: ${result.rating || "\u2014"}  Priority: ${result.priority || "\u2014"}\n`;
  });
  text += `\nPatterns noticed: ${valueOf(data, "assessPatterns")}\n\n`;
  text += "30-DAY ACTIONS\n" + "-".repeat(30) + "\n";
  ["share", "assess", "policy"].forEach((prefix) => {
    ["Action", "Person", "ByWhen", "HowKnow"].forEach((field) => {
      const key = `d30_${prefix}_${field}`;
      if (data[key]) {
        text += `  ${field}: ${data[key]}\n`;
      }
    });
    text += "\n";
  });
  text += `30-day reflection: ${valueOf(data, "d30_reflect")}\n\n`;
  text += "60-DAY ACTIONS\n" + "-".repeat(30) + "\n";
  ["team", "training", "feedback"].forEach((prefix) => {
    Object.keys(data)
      .filter((key) => key.startsWith(`d60_${prefix}`))
      .forEach((key) => {
        text += `  ${key.split("_").slice(2).join(" ")}: ${data[key]}\n`;
      });
    text += "\n";
  });
  text += `60-day reflection: ${valueOf(data, "d60_reflect")}\n\n`;
  text += "90-DAY ACTIONS\n" + "-".repeat(30) + "\n";
  Object.keys(data)
    .filter((key) => key.startsWith("d90_"))
    .forEach((key) => {
      text += `  ${key.replace("d90_", "").replace(/_/g, " ")}: ${data[key]}\n`;
    });
  text += "\n";
  text += "BARRIERS\n" + "-".repeat(30) + "\n";
  HEALING_PLAN_BARRIER_ROWS.forEach((barrier, index) => {
    if (data[`barrier_${index}`]) {
      text += `${barrier.challenge}: ${data[`barrier_${index}`]}\n`;
    }
  });
  text += `\nAdditional barriers: ${valueOf(data, "addlBarriers")}\n`;
  text += `Current assets: ${valueOf(data, "assets")}\nResource gaps: ${valueOf(data, "gaps")}\n`;
  text += `How you'll know: ${valueOf(data, "howKnow")}\nReview timeline: ${valueOf(data, "reviewTimeline")}\n\n`;
  text += `Budget implications: ${valueOf(data, "budget")}\nCapacity building: ${valueOf(data, "capacity")}\n`;
  text += `Knowledge transfer: ${valueOf(data, "knowledge")}\nStrategic integration: ${valueOf(data, "strategic")}\n\n`;
  text += "COMMITMENT\n" + "-".repeat(30) + "\n";
  text += valueOf(data, "commitment");
  text += "\n\n\u2014 Generated from TKB Strategies Healing-Centered Leadership Action Plan";
  return text;
}
