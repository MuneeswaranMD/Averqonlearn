import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename = 'report.xlsx') => {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
        XLSX.writeFile(workbook, filename);
    } catch (error) {
        console.error('Excel Export Error:', error);
    }
};

export const prepareExamDataForExport = (results) => {
    return results.map(r => {
        // Summarize Activity
        const activitySummary = (r.activityLog || [])
            .map(log => `[${new Date(log.timestamp).toLocaleTimeString()}] ${log.action}: ${log.details}`)
            .join(';\n');

        return {
            'Student Name': r.student?.displayName || r.studentName || 'N/A',
            'Roll No': r.student?.rollNo || 'N/A',
            'Department': r.student?.dept || 'N/A',
            'Year': r.student?.year || 'N/A',
            'Batch': r.student?.batchId || 'N/A',
            'Language Used': r.languageUsed || 'N/A',
            'Score': r.score,
            'Total Score': r.totalScore,
            'Percentage': ((r.score / r.totalScore) * 100).toFixed(2) + '%',
            'Status': r.status,
            'Warnings': r.warningCount,
            'Activity Log': activitySummary,
            'Submitted At': new Date(r.submittedAt).toLocaleString()
        };
    });
};

export const prepareTPODataForExport = (results) => {
    return results.map(r => ({
        'Student Name': r.studentId?.displayName || 'N/A',
        'Roll No': r.studentId?.rollNo || 'N/A',
        'Department': r.studentId?.dept || 'N/A',
        'Year': r.studentId?.year || 'N/A',
        'CGPA': r.studentId?.cgpa || 'N/A',
        'Skills': (r.studentId?.skills || []).join(', '),
        'Exam': r.examId?.title || 'N/A',
        'Coding Score': r.score,
        'Technology Stack': r.answers.map(a => a.language).filter((v, i, a) => a.indexOf(v) === i && v).join(', ') || 'N/A',
        'Percentage': ((r.score / r.totalScore) * 100).toFixed(2) + '%',
        'Status': r.status,
        'Violations': r.warningCount,
        'Placement Eligible': r.studentId?.placementProfile?.eligible ? 'YES' : 'NO'
    }));
};
