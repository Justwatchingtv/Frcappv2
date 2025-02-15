
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Position {
  id: string;
  type: 'call' | 'put';
  strike: number;
  price: number;
  quantity: number;
  isBuy: boolean;
  timestamp: string;
  currentPrice?: number;
  pnl?: number;
  greeks?: {
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho: number;
  };
}

interface Greeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export function OptionsChainSimulator() {
  const { toast } = useToast();
  const [ticker, setTicker] = useState('SPY');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [optionsChain, setOptionsChain] = useState([]);
  const [selectedExpiry, setSelectedExpiry] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Initialize WebSocket connection
  useEffect(() => {
    const socket = new WebSocket(`wss://delayed.polygon.io/options`);
    
    socket.onopen = () => {
      socket.send(JSON.stringify({
        action: 'subscribe',
        params: `O.${ticker}`
      }));
    };

    const updateOptionsChainWithRealtimeData = (data: any) => {
    if (data.type === 'trade') {
      setOptionsChain(prevChain => 
        prevChain.map((option: any) => {
          if (option.symbol === data.symbol) {
            return {
              ...option,
              last: data.price,
              volume: option.volume + data.size
            };
          }
          return option;
        })
      );
    }
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateOptionsChainWithRealtimeData(data);
  };

    setWs(socket);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [ticker]);

  // Calculate Greeks using Black-Scholes model
  const calculateGreeks = useCallback((option: any, spotPrice: number, strike: number, timeToExpiry: number, volatility: number, riskFreeRate: number): Greeks => {
    // Implementation of Black-Scholes Greeks calculations
    // This is a simplified version - in production you'd want to use a more robust library
    return {
      delta: 0.5, // Placeholder
      gamma: 0.1,
      theta: -0.05,
      vega: 0.2,
      rho: 0.01
    };
  }, []);

  // Update positions with current P&L
  const updatePositionsPnL = useCallback(() => {
    setPositions((currentPositions) => 
      currentPositions.map((position) => {
        const currentOption = optionsChain.find((opt: any) => 
          opt.strike === position.strike && 
          (position.type === 'call' ? opt.call : opt.put)
        );

        if (!currentOption) return position;

        const currentPrice = position.type === 'call' 
          ? currentOption.call.last 
          : currentOption.put.last;

        const pnl = position.isBuy
          ? (currentPrice - position.price) * position.quantity * 100
          : (position.price - currentPrice) * position.quantity * 100;

        return {
          ...position,
          currentPrice,
          pnl,
          greeks: calculateGreeks(
            currentOption,
            currentPrice,
            position.strike,
            1, // timeToExpiry in years
            0.3, // implied volatility
            0.05 // risk-free rate
          )
        };
      })
    );
  }, [optionsChain, calculateGreeks]);

  // Execute order with position tracking
  const executeOrder = useCallback((strike: number, type: 'call' | 'put', isBuy: boolean, price: number) => {
    const newPosition: Position = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      strike,
      price,
      quantity,
      isBuy,
      timestamp: new Date().toISOString(),
    };

    setPositions(prev => [...prev, newPosition]);
    
    toast({
      title: "Order Executed",
      description: `${isBuy ? 'Bought' : 'Sold'} ${quantity} ${type} ${strike} strike`,
    });
  }, [quantity, toast]);

  // Regular polling for options chain updates (fallback for non-websocket data)
  useEffect(() => {
    const interval = setInterval(updatePositionsPnL, 5000);
    return () => clearInterval(interval);
  }, [updatePositionsPnL]);

  return (
    <div className="space-y-4">
      {/* ... Rest of the UI implementation from the provided code ... */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Positions & P&L</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Strike</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Entry</TableHead>
              <TableHead>Current</TableHead>
              <TableHead>P&L</TableHead>
              <TableHead>Delta</TableHead>
              <TableHead>Gamma</TableHead>
              <TableHead>Theta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((position) => (
              <TableRow key={position.id}>
                <TableCell className="capitalize">{position.type}</TableCell>
                <TableCell>{position.strike}</TableCell>
                <TableCell>{position.quantity}</TableCell>
                <TableCell>${position.price.toFixed(2)}</TableCell>
                <TableCell>${position.currentPrice?.toFixed(2) || '-'}</TableCell>
                <TableCell className={position.pnl && position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                  ${position.pnl?.toFixed(2) || '-'}
                </TableCell>
                <TableCell>{position.greeks?.delta.toFixed(3)}</TableCell>
                <TableCell>{position.greeks?.gamma.toFixed(3)}</TableCell>
                <TableCell>{position.greeks?.theta.toFixed(3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
