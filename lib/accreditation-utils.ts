/**
 * Calculate remaining time until accreditation expires
 * Returns object with days, months, years remaining and color status
 */
export function calculateAccreditationStatus(validUntil: Date | null) {
    if (!validUntil) {
        return {
            daysRemaining: null,
            monthsRemaining: null,
            yearsRemaining: null,
            status: 'unknown' as const,
            color: 'default' as const,
            message: 'Tanggal belum diatur',
        };
    }

    const now = new Date();
    const until = new Date(validUntil);
    const diffTime = until.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate years, months, days
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    // Determine status and color based on remaining time
    let status: 'expired' | 'critical' | 'warning' | 'good' | 'excellent';
    let color: 'danger' | 'warning' | 'success' | 'default';
    let message: string;

    if (diffDays < 0) {
        status = 'expired';
        color = 'danger';
        message = 'Sudah kadaluarsa';
    } else if (diffDays <= 365) {
        // < 1 year = Red
        status = 'critical';
        color = 'danger';
        message = `${diffDays} hari lagi`;
    } else if (diffDays <= 730) {
        // 1-2 years = Yellow
        status = 'warning';
        color = 'warning';
        const totalMonths = Math.floor(diffDays / 30);
        message = `${totalMonths} bulan lagi`;
    } else if (diffDays <= 1460) {
        // 2-4 years = Green
        status = 'good';
        color = 'success';
        message = `${years} tahun ${months} bulan lagi`;
    } else {
        // > 4 years = Green
        status = 'excellent';
        color = 'success';
        message = `${years} tahun ${months} bulan lagi`;
    }

    return {
        daysRemaining: diffDays,
        monthsRemaining: Math.floor(diffDays / 30),
        yearsRemaining: years,
        status,
        color,
        message,
        formattedRemaining: `${years > 0 ? `${years} tahun ` : ''}${months > 0 ? `${months} bulan ` : ''}${days} hari`,
    };
}

/**
 * Format date to Indonesian locale
 */
export function formatDateID(date: Date | string | null): string {
    if (!date) return '-';

    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
