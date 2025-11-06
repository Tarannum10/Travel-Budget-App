import React, { useState, useEffect } from 'react';
import { MapPin, DollarSign, Calendar, PlusCircle, Edit2, Trash2, TrendingUp, Plane, Hotel, Utensils, ShoppingBag, Save, X, AlertCircle } from 'lucide-react';

export default function TravelBudgetApp() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  const [tripForm, setTripForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    currency: 'USD'
  });

  const [expenseForm, setExpenseForm] = useState({
    category: 'food',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { id: 'transport', label: 'Transport', icon: Plane, color: 'blue' },
    { id: 'accommodation', label: 'Accommodation', icon: Hotel, color: 'purple' },
    { id: 'food', label: 'Food & Drinks', icon: Utensils, color: 'green' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'pink' },
    { id: 'activities', label: 'Activities', icon: TrendingUp, color: 'orange' },
    { id: 'other', label: 'Other', icon: DollarSign, color: 'gray' }
  ];

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = () => {
    const mockTrips = [
      {
        _id: '1',
        destination: 'Paris, France',
        startDate: '2024-12-01',
        endDate: '2024-12-10',
        totalBudget: 3000,
        currency: 'USD',
        expenses: [
          { _id: 'e1', category: 'transport', amount: 500, description: 'Flight tickets', date: '2024-12-01' },
          { _id: 'e2', category: 'accommodation', amount: 800, description: 'Hotel booking', date: '2024-12-01' },
          { _id: 'e3', category: 'food', amount: 150, description: 'Restaurants', date: '2024-12-02' }
        ]
      },
      {
        _id: '2',
        destination: 'Tokyo, Japan',
        startDate: '2025-01-15',
        endDate: '2025-01-25',
        totalBudget: 4000,
        currency: 'USD',
        expenses: [
          { _id: 'e4', category: 'transport', amount: 800, description: 'Flight & trains', date: '2025-01-15' },
          { _id: 'e5', category: 'food', amount: 200, description: 'Sushi restaurants', date: '2025-01-16' }
        ]
      }
    ];
    setTrips(mockTrips);
    if (mockTrips.length > 0) setSelectedTrip(mockTrips[0]);
  };

  const calculateTripStats = (trip) => {
    if (!trip) return { spent: 0, remaining: 0, percentage: 0, categoryBreakdown: {} };
    
    const spent = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const remaining = trip.totalBudget - spent;
    const percentage = (spent / trip.totalBudget) * 100;
    
    const categoryBreakdown = {};
    trip.expenses.forEach(exp => {
      categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;
    });
    
    return { spent, remaining, percentage, categoryBreakdown };
  };

  const handleCreateTrip = () => {
    if (!tripForm.destination || !tripForm.startDate || !tripForm.endDate || !tripForm.totalBudget) {
      alert('Please fill all required fields');
      return;
    }

    const newTrip = {
      _id: Date.now().toString(),
      ...tripForm,
      totalBudget: parseFloat(tripForm.totalBudget),
      expenses: []
    };

    setTrips([...trips, newTrip]);
    setSelectedTrip(newTrip);
    setShowTripModal(false);
    setTripForm({ destination: '', startDate: '', endDate: '', totalBudget: '', currency: 'USD' });
  };

  const handleAddExpense = () => {
    if (!expenseForm.amount || !expenseForm.description) {
      alert('Please fill all required fields');
      return;
    }

    const newExpense = {
      _id: Date.now().toString(),
      ...expenseForm,
      amount: parseFloat(expenseForm.amount)
    };

    const updatedTrips = trips.map(trip => {
      if (trip._id === selectedTrip._id) {
        const updatedExpenses = editingExpense
          ? trip.expenses.map(e => e._id === editingExpense._id ? newExpense : e)
          : [...trip.expenses, newExpense];
        return { ...trip, expenses: updatedExpenses };
      }
      return trip;
    });

    setTrips(updatedTrips);
    setSelectedTrip(updatedTrips.find(t => t._id === selectedTrip._id));
    setShowExpenseModal(false);
    setEditingExpense(null);
    setExpenseForm({ category: 'food', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleDeleteExpense = (expenseId) => {
    const updatedTrips = trips.map(trip => {
      if (trip._id === selectedTrip._id) {
        return { ...trip, expenses: trip.expenses.filter(e => e._id !== expenseId) };
      }
      return trip;
    });

    setTrips(updatedTrips);
    setSelectedTrip(updatedTrips.find(t => t._id === selectedTrip._id));
  };

  const openEditExpense = (expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.description,
      date: expense.date
    });
    setShowExpenseModal(true);
  };

  const stats = calculateTripStats(selectedTrip);
  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : DollarSign;
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      green: 'bg-green-100 text-green-700 border-green-300',
      pink: 'bg-pink-100 text-pink-700 border-pink-300',
      orange: 'bg-orange-100 text-orange-700 border-orange-300',
      gray: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[category?.color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Travel Budget Tracker
              </h1>
              <p className="text-gray-600 mt-1">Plan, track, and manage your travel expenses</p>
            </div>
            <button
              onClick={() => setShowTripModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <PlusCircle size={20} />
              New Trip
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Trips Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">My Trips</h2>
              <div className="space-y-2">
                {trips.map(trip => (
                  <button
                    key={trip._id}
                    onClick={() => setSelectedTrip(trip)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedTrip?._id === trip._id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300'
                        : 'bg-white border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{trip.destination}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(trip.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedTrip ? (
              <>
                {/* Trip Overview */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedTrip.destination}</h2>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{new Date(selectedTrip.startDate).toLocaleDateString()} - {new Date(selectedTrip.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Budget Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-blue-700 font-medium mb-1">Total Budget</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {selectedTrip.currency} {selectedTrip.totalBudget.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <p className="text-sm text-red-700 font-medium mb-1">Spent</p>
                      <p className="text-2xl font-bold text-red-900">
                        {selectedTrip.currency} {stats.spent.toLocaleString()}
                      </p>
                      <p className="text-xs text-red-600 mt-1">{stats.percentage.toFixed(1)}% of budget</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-green-700 font-medium mb-1">Remaining</p>
                      <p className="text-2xl font-bold text-green-900">
                        {selectedTrip.currency} {stats.remaining.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Budget Usage</span>
                      <span className="text-sm font-bold text-gray-900">{stats.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          stats.percentage > 90 ? 'bg-red-500' : stats.percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                      />
                    </div>
                    {stats.percentage > 100 && (
                      <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                        <AlertCircle size={16} />
                        <span>Budget exceeded by {selectedTrip.currency} {(stats.spent - selectedTrip.totalBudget).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Spending by Category</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map(category => {
                      const amount = stats.categoryBreakdown[category.id] || 0;
                      const Icon = category.icon;
                      return (
                        <div key={category.id} className={`p-4 rounded-lg border ${getCategoryColor(category.id)}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <Icon size={20} />
                            <span className="font-medium text-sm">{category.label}</span>
                          </div>
                          <p className="text-xl font-bold">{selectedTrip.currency} {amount.toLocaleString()}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expenses List */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Expenses</h3>
                    <button
                      onClick={() => setShowExpenseModal(true)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <PlusCircle size={18} />
                      Add Expense
                    </button>
                  </div>

                  {selectedTrip.expenses.length === 0 ? (
                    <div className="text-center py-12">
                      <DollarSign size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-600">No expenses yet</p>
                      <p className="text-sm text-gray-500 mt-1">Start tracking your travel spending</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedTrip.expenses.map(expense => {
                        const Icon = getCategoryIcon(expense.category);
                        return (
                          <div key={expense._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`p-2 rounded-lg ${getCategoryColor(expense.category)}`}>
                                <Icon size={20} />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{expense.description}</p>
                                <p className="text-sm text-gray-600">
                                  {categories.find(c => c.id === expense.category)?.label} • {new Date(expense.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="font-bold text-gray-900">{selectedTrip.currency} {expense.amount.toLocaleString()}</p>
                              <button
                                onClick={() => openEditExpense(expense)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteExpense(expense._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No trip selected</h3>
                <p className="text-gray-500 mb-4">Create a new trip to start tracking your travel budget</p>
                <button
                  onClick={() => setShowTripModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Create Your First Trip
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trip Modal */}
      {showTripModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Trip</h2>
              <button onClick={() => setShowTripModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Destination *</label>
                <input
                  type="text"
                  value={tripForm.destination}
                  onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Paris, France"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={tripForm.startDate}
                    onChange={(e) => setTripForm({ ...tripForm, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={tripForm.endDate}
                    onChange={(e) => setTripForm({ ...tripForm, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Total Budget *</label>
                  <input
                    type="number"
                    value={tripForm.totalBudget}
                    onChange={(e) => setTripForm({ ...tripForm, totalBudget: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="3000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                  <select
                    value={tripForm.currency}
                    onChange={(e) => setTripForm({ ...tripForm, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD $</option>
                    <option value="EUR">EUR €</option>
                    <option value="GBP">GBP £</option>
                    <option value="INR">INR ₹</option>
                    <option value="JPY">JPY ¥</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowTripModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTrip}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Create Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{editingExpense ? 'Edit' : 'Add'} Expense</h2>
              <button onClick={() => { setShowExpenseModal(false); setEditingExpense(null); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount *</label>
                <input
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Dinner at restaurant"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => { setShowExpenseModal(false); setEditingExpense(null); }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExpense}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  {editingExpense ? 'Update' : 'Add'} Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}