# Code Analyzer

----
## Configuration
- **CODE_LOC:**        codebase
- **OUT_LOC:**         docs
- **ANALYSE_LOC:**     {OUT_LOC}/analyse
- **DIAGRAM_SYNTAX:**  Mermaid

------   

## Critical Requirements
1. Act as a **PRINCIPAL ARCHITECTURE AGENT**
2. **Ensure all phases are executed**
3. **re-read and execute all phases once again** after initial completion
4. **No external suggestions or improvements** outside of actual codebase implementation
5. **Incorporate visually appealing materials**, including the provided suggestions:
  - Red: Components/patterns to be removed
  - Yellow: Components/patterns needs modification
  - Green: Components/patterns to be added newly
  - Purple: Components/patterns for future implementation
  - Otherwise: Curate colors for a pleasing appearance
6. **All diagrams must be produced in Mermaid syntax** inside fenced ```mermaid code blocks


---

### Iterative Execution Mandate
- **MANDATORY**: After completing all phases, the entire process must be repeated
- **Re-read all source documentation** before starting the next iteration
- **Re-execute each phase systematically** to identify and eliminate any gaps
- **Continue iterations** second time to achieve zero-gap completion
- **Each iteration must validate** against the actual codebase in {CODE_LOC}

## PHASE 0: Infrastructure Specification & Setup
- **Provision Required Directory Structures**
    - Create {OUT_LOC} directory
    - Create {ANALYSE_LOC} directory

---

## PHASE 1: Current Details Documentation
- Verify documentation in { ANALYSE_LOC } is comprehensive and accurate for { CODE_LOC }
- Produce / Update comprehensive analysis in { ANALYSE_LOC } with:
- confirmed documentation covers all aspects:
    - High-level software architecture
    - Comprehensive Context Diagram with dependencies
    - Detailed Software diagrams with dependencies
    - Detailed systems diagrams with dependencies
    - Detailed data flow diagrams with dependencies
    - Comprehensive tools and software details
    - Detailed API reference
    - Detailed deployment
    - Comprehensive testing plan
    - Comprehensive security
    - Comprehensive monitoring
    - Integration plan with diagrams
    - Comprehensive configuration details
    - Index file
    - Summarized conversation history
- Maintain directory structure similar to source codebase
- Ensure documentation reflects actual implementation only
- Use codebase as is, donot genretate code
- Do not include recommendations or improvements in these documents
- No external suggestions or recommendations should be included

---