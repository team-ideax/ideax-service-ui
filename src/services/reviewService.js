import initialReviews from '../data/reviews.json';
import { downloadJsonFile } from './projectService';

const STORAGE_KEY = 'ideax_reviews_data';

class ReviewService {
  constructor() {
    this.listeners = [];
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  getReviews() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReviews));
      return initialReviews;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialReviews;
    }
  }

  getPublishedReviews() {
    return this.getReviews().filter(r => r.published);
  }

  getReviewById(id) {
    return this.getReviews().find(r => r.id === id) || null;
  }

  generateNextId(existingReviews) {
    const ids = existingReviews
      .map(r => {
        const num = parseInt(r.id?.replace(/\D/g, '') || '0', 10);
        return isNaN(num) ? 0 : num;
      })
      .filter(n => n > 0);
    const max = ids.length ? Math.max(...ids) : 0;
    return `REV${String(max + 1).padStart(3, '0')}`;
  }

  saveReviews(reviews) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    this.notify();
  }

  validateReview(data) {
    const errors = {};
    if (!data.customerName || !data.customerName.trim()) {
      errors.customerName = 'Customer name is required.';
    }
    if (!data.feedback || !data.feedback.trim()) {
      errors.feedback = 'Customer feedback is required.';
    }
    if (data.rating !== undefined && data.rating !== null && data.rating !== '') {
      const num = Number(data.rating);
      if (isNaN(num) || num < 1 || num > 5) {
        errors.rating = 'Rating must be between 1 and 5.';
      }
    }
    if (data.imageUrl && data.imageUrl.trim()) {
      try {
        new URL(data.imageUrl);
      } catch {
        errors.imageUrl = 'Please provide a valid image URL.';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  createReview(reviewData) {
    const current = this.getReviews();
    const validation = this.validateReview(reviewData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const newId = reviewData.id?.trim() || this.generateNextId(current);
    if (current.some(r => r.id === newId)) {
      return { success: false, errors: { id: `Review ID ${newId} already exists.` } };
    }

    const newReview = {
      id: newId,
      customerName: reviewData.customerName.trim(),
      feedback: reviewData.feedback.trim(),
      projectName: (reviewData.projectName || '').trim(),
      rating: reviewData.rating ? Number(reviewData.rating) : 5,
      imageUrl: (reviewData.imageUrl || '').trim(),
      reviewDate: reviewData.reviewDate || new Date().toISOString().split('T')[0],
      published: reviewData.published !== undefined ? Boolean(reviewData.published) : false,
    };

    const updated = [newReview, ...current];
    this.saveReviews(updated);
    return { success: true, review: newReview };
  }

  updateReview(id, reviewData) {
    const current = this.getReviews();
    const index = current.findIndex(r => r.id === id);
    if (index === -1) {
      return { success: false, errors: { general: 'Review not found.' } };
    }

    const validation = this.validateReview(reviewData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const updatedReview = {
      ...current[index],
      customerName: reviewData.customerName.trim(),
      feedback: reviewData.feedback.trim(),
      projectName: (reviewData.projectName || '').trim(),
      rating: reviewData.rating ? Number(reviewData.rating) : 5,
      imageUrl: (reviewData.imageUrl || '').trim(),
      reviewDate: reviewData.reviewDate || current[index].reviewDate,
      published: Boolean(reviewData.published),
    };

    const updatedList = [...current];
    updatedList[index] = updatedReview;
    this.saveReviews(updatedList);
    return { success: true, review: updatedReview };
  }

  deleteReview(id) {
    const current = this.getReviews();
    const filtered = current.filter(r => r.id !== id);
    if (filtered.length === current.length) {
      return { success: false, message: 'Review not found.' };
    }
    this.saveReviews(filtered);
    return { success: true };
  }

  togglePublish(id) {
    const current = this.getReviews();
    const review = current.find(r => r.id === id);
    if (!review) return false;
    return this.updateReview(id, { ...review, published: !review.published });
  }

  exportJSON() {
    const data = this.getReviews();
    downloadJsonFile('reviews.json', data);
  }

  resetToDefault() {
    this.saveReviews(initialReviews);
  }
}

export const reviewService = new ReviewService();
