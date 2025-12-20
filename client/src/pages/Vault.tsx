import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FolderPlus, Share2, FileUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Vault() {
  return (
    <div className="flex flex-col min-h-full max-w-5xl mx-auto w-full p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-heading font-semibold mb-2">Vault</h1>
          <p className="text-muted-foreground">Upload, store, and analyze documents</p>
        </motion.div>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl border border-border/50 bg-card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FolderPlus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Create project</h3>
              <p className="text-sm text-muted-foreground">Upload a new collection of files or folders</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl border border-border/50 bg-card hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Share2 className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Create a knowledge base</h3>
              <p className="text-sm text-muted-foreground">Distribute files to your org</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="flex-1">
        <TabsList className="bg-secondary/30 border-b border-border/50 p-0 h-auto rounded-none mb-6">
          <TabsTrigger value="all" className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
            All projects
          </TabsTrigger>
          <TabsTrigger value="yours" className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
            Your projects
          </TabsTrigger>
          <TabsTrigger value="shared" className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
            Shared with you
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <EmptyState />
        </TabsContent>

        <TabsContent value="yours" className="mt-0">
          <EmptyState message="You haven't created any projects yet" />
        </TabsContent>

        <TabsContent value="shared" className="mt-0">
          <EmptyState message="No projects shared with you yet" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ message }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-4">
        <FileUp className="w-8 h-8 text-muted-foreground/40" />
      </div>
      <p className="text-muted-foreground mb-6">{message || 'No projects found'}</p>
      <Button onClick={() => alert('Upload modal would appear here')}>
        <FolderPlus className="w-4 h-4 mr-2" />
        Create your first project
      </Button>
    </motion.div>
  );
}
