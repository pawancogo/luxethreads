import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Star, ThumbsUp, ThumbsDown, Verified, Loader2, MessageSquare } from 'lucide-react';
import { reviewsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

interface Review {
  id: number;
  user: {
    id: number;
    name: string;
    email?: string;
  };
  rating: number;
  title?: string;
  comment: string;
  is_verified_purchase?: boolean;
  is_featured?: boolean;
  helpful_count?: number;
  not_helpful_count?: number;
  review_images?: string[];
  created_at: string;
  supplier_response?: string;
}

interface ProductReviewsProps {
  productId: number;
  averageRating?: number;
  totalReviews?: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, averageRating, totalReviews }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'verified' | 'featured'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating_high' | 'rating_low'>('recent');

  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  useEffect(() => {
    loadReviews();
  }, [productId, filter]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        moderation_status: 'approved', // Only show approved reviews
      };
      
      if (filter === 'verified') {
        params.verified = true;
      } else if (filter === 'featured') {
        params.featured = true;
      }

      const response = await reviewsAPI.getProductReviews(productId, params);
      setReviews(Array.isArray(response) ? response : []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to write a review',
        variant: 'destructive',
      });
      return;
    }

    if (!newReview.comment || newReview.comment.length < 10) {
      toast({
        title: 'Validation Error',
        description: 'Please write a review with at least 10 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewsAPI.createReview(productId, {
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
      });
      
      toast({
        title: 'Success',
        description: 'Your review has been submitted and will be visible after moderation',
      });
      
      setIsDialogOpen(false);
      setNewReview({ rating: 5, title: '', comment: '' });
      loadReviews();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (reviewId: number, isHelpful: boolean) => {
    if (!user) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to vote',
        variant: 'destructive',
      });
      return;
    }

    try {
      await reviewsAPI.voteHelpful(productId, reviewId, isHelpful);
      loadReviews();
    } catch (error: any) {
      // Silently fail - voting shouldn't break the page
      console.error('Failed to vote:', error);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating_high':
        return b.rating - a.rating;
      case 'rating_low':
        return a.rating - b.rating;
      case 'helpful':
        return (b.helpful_count || 0) - (a.helpful_count || 0);
      case 'recent':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? Math.round((reviews.filter(r => r.rating === rating).length / reviews.length) * 100)
      : 0,
  }));

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Customer Reviews</CardTitle>
            {averageRating && totalReviews && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-2xl font-bold ml-1">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-gray-600">({totalReviews} reviews)</span>
              </div>
            )}
          </div>
          {user && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Write a Review</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                  <DialogDescription>
                    Share your experience with this product
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Rating *</Label>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              rating <= newReview.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="review-title">Title (Optional)</Label>
                    <input
                      id="review-title"
                      type="text"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                      value={newReview.title}
                      onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                      placeholder="Summarize your experience"
                    />
                  </div>
                  <div>
                    <Label htmlFor="review-comment">Review *</Label>
                    <Textarea
                      id="review-comment"
                      className="mt-1"
                      rows={5}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Write your review here (minimum 10 characters)..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {newReview.comment.length}/10 minimum characters
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Review'
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-6">
            <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="verified">Verified Purchase</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
                <SelectItem value="rating_high">Highest Rating</SelectItem>
                <SelectItem value="rating_low">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : sortedReviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          className={`h-4 w-4 ${
                            rating <= review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {review.is_verified_purchase && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Verified className="h-3 w-3 mr-1" />
                        Verified Purchase
                      </Badge>
                    )}
                    {review.is_featured && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mb-2">
                  <h4 className="font-semibold">{review.user.name}</h4>
                  {review.title && (
                    <h5 className="font-medium text-gray-900 mt-1">{review.title}</h5>
                  )}
                </div>
                
                <p className="text-gray-700 mb-3">{review.comment}</p>
                
                {review.review_images && review.review_images.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {review.review_images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
                
                {review.supplier_response && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Supplier Response:</p>
                    <p className="text-sm text-blue-800">{review.supplier_response}</p>
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Was this helpful?</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(review.id, true)}
                      className="h-8"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {review.helpful_count || 0}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(review.id, false)}
                      className="h-8"
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      {review.not_helpful_count || 0}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductReviews;

