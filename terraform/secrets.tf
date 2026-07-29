resource "github_actions_secret" "jeopardy_workflow_automation" {
  repository      = "rwsdk-jeopardy"
  secret_name     = "JEOPARDY_WORKFLOW_AUTOMATION"
  value = var.jeopardy_workflow_automation
}
