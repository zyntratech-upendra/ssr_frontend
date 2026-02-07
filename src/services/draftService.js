// Draft Management Service
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Save application draft
 * @param {Object} draftData - Complete form data to save
 * @param {String} draftId - Optional: existing draft ID to update
 * @returns {Promise}
 */
export const saveDraft = async (draftData, draftId = null) => {
  try {
    const payload = {
      draftData,
      status: 'draft'
    };

    const url = draftId 
      ? `${API_BASE}/drafts/${draftId}`
      : `${API_BASE}/drafts`;

    const method = draftId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Failed to save draft: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Draft save error:', error);
    throw error;
  }
};

/**
 * Get all saved drafts for current user
 * @returns {Promise<Array>}
 */
export const getSavedDrafts = async () => {
  try {
    const response = await fetch(`${API_BASE}/drafts/user`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch drafts');
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Fetch drafts error:', error);
    throw error;
  }
};

/**
 * Get specific draft by ID
 * @param {String} draftId - Draft ID
 * @returns {Promise}
 */
export const getDraftById = async (draftId) => {
  try {
    const response = await fetch(`${API_BASE}/drafts/${draftId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch draft');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch draft error:', error);
    throw error;
  }
};

/**
 * Delete a draft
 * @param {String} draftId - Draft ID
 * @returns {Promise}
 */
export const deleteDraft = async (draftId) => {
  try {
    const response = await fetch(`${API_BASE}/drafts/${draftId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete draft');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete draft error:', error);
    throw error;
  }
};

/**
 * Save draft to localStorage as backup
 * @param {Object} draftData - Form data
 * @param {String} key - Storage key (optional)
 */
export const saveLocalDraft = (draftData, key = 'admission_draft') => {
  try {
    const backup = {
      data: draftData,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(backup));
    return true;
  } catch (error) {
    console.error('Local storage save error:', error);
    return false;
  }
};

/**
 * Get draft from localStorage
 * @param {String} key - Storage key
 * @returns {Object|null}
 */
export const getLocalDraft = (key = 'admission_draft') => {
  try {
    const backup = localStorage.getItem(key);
    return backup ? JSON.parse(backup) : null;
  } catch (error) {
    console.error('Local storage read error:', error);
    return null;
  }
};

/**
 * Clear local draft
 * @param {String} key - Storage key
 */
export const clearLocalDraft = (key = 'admission_draft') => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Local storage clear error:', error);
    return false;
  }
};
