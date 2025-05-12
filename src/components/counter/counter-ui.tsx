'use client'

import { PublicKey } from '@solana/web3.js'
import { useState } from 'react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { ellipsify } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useCrudProgram, useCrudProgramAccount } from './counter-data-access'
import { useWallet } from '@solana/wallet-adapter-react'
import { Textarea } from './text-area'

export function CounterCreate() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createEntry } = useCrudProgram();
  const { publicKey } = useWallet();

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("Please fill in both title and content");
      return;
    }
    try {
      if (publicKey){ 
        await createEntry.mutateAsync({ title, content, owner: publicKey });
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Create New Blog Post</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Write your blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={createEntry.isPending}
          className="w-full"
        >
          {createEntry.isPending ? "Publishing..." : "Publish Blog Post"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function CounterList() {
  const { getProgramAccount, accounts } = useCrudProgram()

  if (getProgramAccount.isLoading) {
    return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
  }
  
  if (!getProgramAccount.data?.value) {
    return (
      <Card className="bg-muted/50 border-muted mb-6">
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">
            Program account not found. Make sure you have deployed the program and are on the correct cluster.
          </p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Blog Posts</h2>
      
      {accounts.isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : accounts.data?.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {accounts.data?.map((account) => (
            <CounterCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-muted/50 border-muted">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't published any blog posts yet</p>
            <p className="text-sm">Create your first post using the form above</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function CounterCard({ account }: { account: PublicKey }) {
  const { accountQuery, updateEntry, deleteEntry } = useCrudProgramAccount({
    account,
  });

  const { publicKey } = useWallet();
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  const title = accountQuery.data?.title;
  const currentContent = accountQuery.data?.content;

  const handleSubmit = async () => {
    if (publicKey && title && content) {
      try {
        await updateEntry.mutateAsync({ title, content });
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating blog post:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (!title) return;
    
    if (window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      try {
        await deleteEntry.mutateAsync(title);
      } catch (error) {
        console.error("Error deleting blog post:", error);
      }
    }
  };

  if (accountQuery.isLoading) {
    return (
      <Card className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{accountQuery.data?.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px]"
            placeholder="Edit your blog content..."
          />
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-line">{currentContent}</p>
          </div>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground">
          <ExplorerLink
            path={`account/${account}`}
            label={`View on-chain data: ${ellipsify(account.toString())}`}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        {isEditing ? (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleSubmit}
              disabled={updateEntry.isPending}
              className="ml-auto"
            >
              {updateEntry.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setContent(currentContent || "");
                setIsEditing(true);
              }}
            >
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDelete}
              disabled={deleteEntry.isPending}
              className="ml-auto"
            >
              {deleteEntry.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}