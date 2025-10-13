"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

export const TableView = ({ data }: { data: Record<string, any>[] }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Get all unique keys from the data
  const keys = Array.from(
    new Set(data.flatMap((row) => Object.keys(row)))
  );

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  {keys.map((key) => (
                    <TableHead
                      key={key}
                      className="text-xs font-semibold text-muted-foreground"
                    >
                      {key}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <motion.tr
                    key={rowIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rowIndex * 0.05 }}
                  >
                    {keys.map((key) => (
                      <TableCell
                        key={key}
                        className="text-sm text-foreground"
                      >
                        {row[key] !== undefined && row[key] !== null
                          ? String(row[key])
                          : "-"}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

