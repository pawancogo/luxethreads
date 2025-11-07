import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, TrendingUp, TrendingDown, Clock, Loader2 } from 'lucide-react';
import { loyaltyPointsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface LoyaltyTransaction {
  id: number;
  transaction_type: 'earned' | 'redeemed' | 'expired' | 'adjusted';
  points: number;
  balance_after: number;
  reference_type?: string;
  reference_id?: number;
  description?: string;
  expiry_date?: string;
  created_at: string;
}

interface Balance {
  balance: number;
  pending_expiry: number;
  available_balance: number;
}

const LoyaltyPoints: React.FC = () => {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'earned' | 'redeemed'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await loyaltyPointsAPI.getBalance();
      if (response.data?.success && response.data?.data) {
        setBalance(response.data.data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch loyalty points balance',
        variant: 'destructive',
      });
    }
  };

  const fetchTransactions = async (type?: string) => {
    setIsLoading(true);
    try {
      const response = await loyaltyPointsAPI.getTransactions(
        type ? { transaction_type: type as any } : undefined
      );
      if (response.data?.success && response.data?.data) {
        setTransactions(response.data.data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (filter === 'all') {
      fetchTransactions();
    } else {
      fetchTransactions(filter);
    }
  }, [filter]);

  const filteredTransactions = filter === 'all' 
    ? transactions
    : transactions.filter(t => t.transaction_type === filter);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'redeemed':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      case 'expired':
        return <Clock className="h-5 w-5 text-gray-600" />;
      default:
        return <Gift className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
        return 'text-green-600';
      case 'redeemed':
        return 'text-red-600';
      case 'expired':
        return 'text-gray-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Loyalty Points</h1>

      {/* Balance Card */}
      {balance && (
        <Card className="mb-6 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-6 w-6 text-pink-600" />
              Your Points Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-gray-900">{balance.available_balance}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                <p className="text-3xl font-bold text-gray-900">{balance.balance}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Expiry</p>
                <p className="text-3xl font-bold text-orange-600">{balance.pending_expiry}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View your loyalty points activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="earned">Earned</TabsTrigger>
              <TabsTrigger value="redeemed">Redeemed</TabsTrigger>
            </TabsList>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Gift className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No transactions found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {filter === 'all' 
                    ? 'You have no loyalty points transactions yet'
                    : `You have no ${filter} transactions yet`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getTransactionIcon(transaction.transaction_type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold capitalize">
                            {transaction.transaction_type.replace('_', ' ')}
                          </p>
                          <Badge variant="outline" className={getTransactionColor(transaction.transaction_type)}>
                            {transaction.points > 0 ? '+' : ''}{transaction.points} points
                          </Badge>
                        </div>
                        {transaction.description && (
                          <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                          {transaction.expiry_date && (
                            <span className="ml-2">
                              • Expires {new Date(transaction.expiry_date).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Balance after</p>
                      <p className="font-semibold">{transaction.balance_after}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyPoints;

