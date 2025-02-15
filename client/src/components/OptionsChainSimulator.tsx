import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface OptionsChain {
  strike: number;
  calls: {
    bid: number;
    ask: number;
    volume: number;
  };
  puts: {
    bid: number;
    ask: number;
    volume: number;
  };
}

interface Position {
  type: 'call' | 'put';
  strike: number;
  quantity: number;
  entry: number;
  current: number;
  pnl: number;
  delta: number;
}

export function OptionsChainSimulator() {
  const { toast } = useToast();
  const [symbol, setSymbol] = useState('SPY');
  const [expiryDate, setExpiryDate] = useState('14 Feb 25');
  const [optionsChain, setOptionsChain] = useState<OptionsChain[]>([
    { strike: 607, calls: { bid: 2.59, ask: 3.00, volume: 150 }, puts: { bid: 0.00, ask: 0.0, volume: 0 } },
    { strike: 608, calls: { bid: 1.62, ask: 2.05, volume: 89 }, puts: { bid: 0.00, ask: 0.0, volume: 0 } },
    { strike: 609, calls: { bid: 0.78, ask: 0.90, volume: 234 }, puts: { bid: 0.00, ask: 0.0, volume: 0 } },
    { strike: 610, calls: { bid: 0.02, ask: 0.03, volume: 567 }, puts: { bid: 0.18, ask: 0.2, volume: 123 } },
    { strike: 611, calls: { bid: 0.00, ask: 0.01, volume: 89 }, puts: { bid: 1.11, ask: 1.2, volume: 445 } },
    { strike: 612, calls: { bid: 0.00, ask: 0.01, volume: 34 }, puts: { bid: 2.02, ask: 2.5, volume: 234 } },
    { strike: 613, calls: { bid: 0.00, ask: 0.01, volume: 12 }, puts: { bid: 2.98, ask: 3.5, volume: 567 } },
    { strike: 614, calls: { bid: 0.00, ask: 0.01, volume: 5 }, puts: { bid: 3.64, ask: 4.7, volume: 89 } },
  ]);

  const [positions, setPositions] = useState<Position[]>([]);

  const executeOrder = (strike: number, type: 'call' | 'put', quantity: number, price: number) => {
    const newPosition: Position = {
      type,
      strike,
      quantity,
      entry: price,
      current: price,
      pnl: 0,
      delta: type === 'call' ? 0.45 : -0.45,
    };

    setPositions(prev => [...prev, newPosition]);
    toast({
      title: "Order Executed",
      description: `${quantity} ${strike} ${type.toUpperCase()} @ $${price}`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input 
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-24"
            placeholder="Symbol"
          />
          <Select value={expiryDate} onValueChange={setExpiryDate}>
            <SelectTrigger className="w-32">
              <SelectValue>{expiryDate}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="14 Feb 25">14 Feb 25</SelectItem>
              <SelectItem value="21 Feb 25">21 Feb 25</SelectItem>
              <SelectItem value="28 Feb 25">28 Feb 25</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="icon">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[100px]">Calls</TableHead>
            <TableHead className="text-right">Bid</TableHead>
            <TableHead className="text-right">Ask</TableHead>
            <TableHead className="text-center">Strike</TableHead>
            <TableHead className="text-right">Bid</TableHead>
            <TableHead className="text-right">Ask</TableHead>
            <TableHead className="w-[100px] text-right">Puts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {optionsChain.map((option) => (
            <TableRow key={option.strike}>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => executeOrder(option.strike, 'call', 1, option.calls.ask)}
                >
                  Buy
                </Button>
              </TableCell>
              <TableCell className="text-right">{option.calls.bid.toFixed(2)}</TableCell>
              <TableCell className="text-right">{option.calls.ask.toFixed(2)}</TableCell>
              <TableCell className="text-center font-medium">{option.strike}</TableCell>
              <TableCell className="text-right">{option.puts.bid.toFixed(2)}</TableCell>
              <TableCell className="text-right">{option.puts.ask.toFixed(2)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => executeOrder(option.strike, 'put', 1, option.puts.ask)}
                >
                  Buy
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-8">
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((position, index) => (
              <TableRow key={index}>
                <TableCell className="capitalize">{position.type}</TableCell>
                <TableCell>{position.strike}</TableCell>
                <TableCell>{position.quantity}</TableCell>
                <TableCell>${position.entry.toFixed(2)}</TableCell>
                <TableCell>${position.current.toFixed(2)}</TableCell>
                <TableCell className={position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                  ${position.pnl.toFixed(2)}
                </TableCell>
                <TableCell>{position.delta.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}