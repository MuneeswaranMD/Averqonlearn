const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const TEMP_DIR = path.join(__dirname, '../temp');

// ... (Existing LANGUAGE_CONFIG remains same)

const CodeExecutionService = {
    // ... (Existing execute method remains same)

    analyzeCodeQuality: (language, code) => {
        // Create a temporary file for analysis
        const jobId = uuidv4();
        const jobDir = path.join(TEMP_DIR, jobId + '_analysis');
        if (!fs.existsSync(jobDir)) fs.mkdirSync(jobDir);
        
        try {
            let score = 10; // Default full score
            let feedback = "No linter available.";

            if (language === 'python') {
                const filePath = path.join(jobDir, 'main.py');
                fs.writeFileSync(filePath, code);
                
                try {
                    // Try running pylint
                    // Note: This requires pylint to be installed in the server environment
                    const output = execSync(`pylint "${filePath}" --disable=C0114,C0115,C0116`, { timeout: 5000 }).toString();
                    const match = output.match(/rated at (-?\d+\.\d+)\/10/);
                    if (match) {
                        score = parseFloat(match[1]);
                        feedback = "Pylint Analysis: Code structure is good.";
                        if(score < 5) feedback = "Pylint Analysis: Improve names and formatting.";
                    }
                } catch (e) {
                    // Pylint often exits with non-zero for lint errors, but stdout has the score
                    if (e.stdout) {
                        const output = e.stdout.toString();
                        const match = output.match(/rated at (-?\d+\.\d+)\/10/);
                        if (match) {
                            score = parseFloat(match[1]);
                        } else {
                            score = 5; // Fallback if execution worked but no score found
                        }
                    } else {
                         // Pylint likely not installed
                         console.warn("Linter skipped (pylint not found)");
                    }
                }
            }
            
            // Clean up
            try { fs.rmSync(jobDir, { recursive: true, force: true }); } catch(err) {}

            return Math.max(0, Math.min(10, score));
        } catch (error) {
            console.error("Code Analysis Error:", error);
            try { fs.rmSync(jobDir, { recursive: true, force: true }); } catch(err) {}
            return 10; // Fail gracefully to full score
        }
    },

    evaluateSubmission: async (code, language, testCases, timeLimit) => {
        // ... (Existing evaluate logic)
        let passedCount = 0;
        let totalTime = 0;
        let executionResults = [];
        const totalCount = testCases.length;

        // If no test cases, run once
        if (totalCount === 0) {
             const res = await CodeExecutionService.execute(code, language, '');
             return {
                 overallStatus: res.status === 'Success' ? 'Accepted' : res.status,
                 passedCount: res.status === 'Success' ? 1 : 0,
                 totalCount: 1,
                 averageTime: res.duration || 0,
                 details: [res],
                 qualityScore: CodeExecutionService.analyzeCodeQuality(language, code)
             };
        }

        for (const testCase of testCases) {
            // ... (Existing loop implementation)
            const input = testCase.input || '';
            const expectedOutput = (testCase.output || '').trim();
            
            const result = await CodeExecutionService.execute(code, language, input);
            totalTime += (result.duration || 0);
            
            const actualOutput = (result.output || '').trim();
            
            let isPassed = false;
            
            if (result.status === 'Success') {
                if (actualOutput === expectedOutput) {
                    isPassed = true;
                } else {
                     if (actualOutput.replace(/\r\n/g, '\n') === expectedOutput.replace(/\r\n/g, '\n')) {
                         isPassed = true;
                     }
                }
            }
            
            if (isPassed) passedCount++;
            
            executionResults.push({
                input,
                expectedOutput,
                actualOutput,
                status: isPassed ? 'Pass' : (result.status === 'Success' ? 'Wrong Answer' : result.status),
                isHidden: testCase.isHidden
            });
            
            if (result.status === 'Runtime Error') break;
        }

        const overallStatus = passedCount === totalCount ? 'Accepted' : 'Partial / Failed';
        const qualityScore = CodeExecutionService.analyzeCodeQuality(language, code);

        return {
            overallStatus,
            passedCount,
            totalCount,
            averageTime: totalTime / totalCount,
            executionResults,
            qualityScore 
        };
    }
};

module.exports = CodeExecutionService;
