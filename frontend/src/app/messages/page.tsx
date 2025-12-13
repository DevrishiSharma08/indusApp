
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
  ArrowLeft, Search, Send, Paperclip, Trash2, Share2, Users as UsersIcon,
  UserPlus, Image as ImageIcon, FileText, File, X, Download, Edit2, Smile, ChevronDown, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Comprehensive emoji data like WhatsApp
const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
  '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
  '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓',
  '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
  '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾',
  '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟',
  '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏',
  '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
  '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐',
  '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️',
  '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️',
  '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️',
  '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', '🌀', '➿', '🌍', '🌎', '🌏', '🌐', '🗺️', '🗾', '🧭', '🏔️'
];

// Types
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
  files?: FileAttachment[];
}

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface Chat {
  id: string;
  name: string;
  type: 'user' | 'client' | 'group';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  members?: string[];
}

// Mock data
const mockInternalChats: Chat[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    type: 'user',
    lastMessage: 'Let me know when you are free',
    lastMessageTime: '10:30 AM',
    unreadCount: 2
  },
  {
    id: '2',
    name: 'Mike Johnson',
    type: 'user',
    lastMessage: 'Thanks for the update!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0
  },
  {
    id: 'g1',
    name: 'Sales Team',
    type: 'group',
    lastMessage: 'Meeting at 3 PM today',
    lastMessageTime: '2 hours ago',
    unreadCount: 5,
    members: ['Sarah Wilson', 'Mike Johnson', 'Emma Davis']
  }
];

const mockClientChats: Chat[] = [
  {
    id: '1',
    name: 'John Doe',
    type: 'client',
    lastMessage: 'When can we schedule a demo?',
    lastMessageTime: '11:45 AM',
    unreadCount: 1
  },
  {
    id: '2',
    name: 'Jane Smith',
    type: 'client',
    lastMessage: 'Received the proposal, reviewing it',
    lastMessageTime: '1 day ago',
    unreadCount: 0
  }
];

// Available team members and clients for group creation
const availableTeamMembers = [
  { id: '1', name: 'Sarah Wilson' },
  { id: '2', name: 'Mike Johnson' },
  { id: '3', name: 'Emma Davis' },
  { id: '4', name: 'David Brown' },
  { id: '5', name: 'Lisa Anderson' }
];

const availableClients = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Robert Johnson' },
  { id: '4', name: 'Maria Garcia' }
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Sarah Wilson',
    content: 'Hi! How are you doing?',
    timestamp: '10:25 AM',
    isCurrentUser: false
  },
  {
    id: '2',
    senderId: 'current',
    senderName: 'You',
    content: 'I am good, thanks! Working on the CRM module.',
    timestamp: '10:26 AM',
    isCurrentUser: true
  },
  {
    id: '3',
    senderId: '2',
    senderName: 'Sarah Wilson',
    content: 'Let me know when you are free',
    timestamp: '10:30 AM',
    isCurrentUser: false
  }
];

export default function MessagesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'internal' | 'clients'>('internal');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [messageInput, setMessageInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  // Emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Message actions
  const [isForwardDialogOpen, setIsForwardDialogOpen] = useState(false);
  const [forwardTo, setForwardTo] = useState('');

  // Group creation
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    setMessages(mockMessages);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() && attachedFiles.length === 0) return;
    if (!selectedChat) return;

    if (editingMessage) {
      setMessages(messages.map(m =>
        m.id === editingMessage.id ? { ...m, content: messageInput } : m
      ));
      setEditingMessage(null);
      toast.success('Message updated!');
    } else {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: 'current',
        senderName: 'You',
        content: messageInput,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
        files: attachedFiles.length > 0 ? attachedFiles.map((file, idx) => ({
          id: `${Date.now()}-${idx}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file)
        })) : undefined
      };

      setMessages([...messages, newMessage]);
      toast.success('Message sent!');
    }

    setMessageInput('');
    setAttachedFiles([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachedFiles([...attachedFiles, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleDeleteMessage = (message: Message) => {
    setMessages(messages.filter(m => m.id !== message.id));
    toast.success('Message deleted');
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setMessageInput(message.content);
  };

  const handleForwardMessage = () => {
    setIsForwardDialogOpen(true);
  };

  const confirmForward = () => {
    if (forwardTo) {
      toast.success(`Message forwarded to ${forwardTo}`);
      setIsForwardDialogOpen(false);
      setForwardTo('');
    }
  };

  const handleDownloadFile = (file: FileAttachment) => {
    toast.success(`Downloading ${file.name}`);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(messageInput + emoji);
    setShowEmojiPicker(false);
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      toast.error('Please enter group name');
      return;
    }
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one member');
      return;
    }
    toast.success(`Group "${groupName}" created with ${selectedMembers.length} members!`);
    setIsCreateGroupOpen(false);
    setGroupName('');
    setSelectedMembers([]);
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const filteredInternalChats = mockInternalChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClientChats = mockClientChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <DashboardLayout>
    <div className="flex flex-col h-full">
      {/* Header with Search */}
      <div className="flex items-center gap-2 mb-3 pt-3 lg:pt-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8 flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground flex-shrink-0">Messages</h2>

        <div className="flex-1" />

        {/* Search - Expandable */}
        {isSearchOpen ? (
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-9 h-9 text-sm"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="absolute right-0.5 top-0.5 h-8 w-8"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="h-8 w-8 flex-shrink-0"
          >
            <Search className="w-4 h-4" />
          </Button>
        )}

        <Button
          size="sm"
          onClick={() => setIsCreateGroupOpen(true)}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Group</span>
        </Button>
      </div>

      {/* Tabs - Hidden on mobile when chat selected */}
      {!selectedChat && (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'internal' | 'clients')} className="mb-3 lg:block">
          <TabsList className="w-full">
            <TabsTrigger value="internal" className="flex-1">Internal Team</TabsTrigger>
            <TabsTrigger value="clients" className="flex-1">Clients</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Tabs for desktop - Always visible */}
      {selectedChat && (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'internal' | 'clients')} className="mb-3 hidden lg:block">
          <TabsList className="w-full">
            <TabsTrigger value="internal" className="flex-1">Internal Team</TabsTrigger>
            <TabsTrigger value="clients" className="flex-1">Clients</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Main Content */}
      <div className="flex-1 pb-3 lg:pb-4 overflow-hidden">
        <div className="flex gap-3 h-full">
          {/* Chat List - Always visible on desktop, hidden on mobile when chat selected */}
          <Card className={cn(
            "flex-col overflow-hidden lg:w-80 lg:flex-shrink-0",
            selectedChat ? "hidden lg:flex" : "flex w-full"
          )}>
            <CardContent className="p-0 flex flex-col h-full">
              {/* Internal Chats */}
              {activeTab === 'internal' && (
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-0.5">
                    {filteredInternalChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleChatSelect(chat)}
                        className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors hover:bg-muted"
                      >
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {chat.type === 'group' ? (
                            <UsersIcon className="w-4 h-4 text-primary" />
                          ) : (
                            <span className="text-xs font-semibold text-primary">
                              {chat.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-sm font-medium truncate">{chat.name}</span>
                            <span className="text-[10px] text-muted-foreground flex-shrink-0">
                              {chat.lastMessageTime}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                            {chat.unreadCount > 0 && (
                              <Badge className="h-4 min-w-4 px-1 text-[10px]">{chat.unreadCount}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              {/* Client Chats */}
              {activeTab === 'clients' && (
                <ScrollArea className="h-full">
                  <div className="p-2 space-y-0.5">
                    {filteredClientChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleChatSelect(chat)}
                        className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors hover:bg-muted"
                      >
                        <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-purple-500">
                            {chat.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-sm font-medium truncate">{chat.name}</span>
                            <span className="text-[10px] text-muted-foreground flex-shrink-0">
                              {chat.lastMessageTime}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                            {chat.unreadCount > 0 && (
                              <Badge className="h-4 min-w-4 px-1 text-[10px]">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Chat Window - Full width on mobile, flex-1 on desktop */}
          {selectedChat && (
          <Card className={cn(
            "flex flex-col overflow-hidden",
            selectedChat ? "w-full lg:flex-1" : "hidden"
          )}>
            {/* Chat Header - Compact */}
            <div className="border-b px-3 py-2 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 lg:hidden"
                  onClick={() => setSelectedChat(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  selectedChat.type === 'client' ? 'bg-purple-500/10' : 'bg-primary/10'
                )}>
                  {selectedChat.type === 'group' ? (
                    <UsersIcon className="w-4 h-4 text-primary" />
                  ) : (
                    <span className={cn(
                      "text-xs font-semibold",
                      selectedChat.type === 'client' ? 'text-purple-500' : 'text-primary'
                    )}>
                      {selectedChat.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{selectedChat.name}</h3>
                  {selectedChat.type === 'group' && selectedChat.members && (
                    <p className="text-xs text-muted-foreground">
                      {selectedChat.members.length} members
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages Area - With Scroll */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.isCurrentUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[70%] space-y-1",
                      message.isCurrentUser && "order-2"
                    )}>
                      {!message.isCurrentUser && (
                        <span className="text-xs text-muted-foreground font-medium pl-2">
                          {message.senderName}
                        </span>
                      )}
                      <div className="group relative">
                        <div className={cn(
                          "rounded-lg px-3 py-2 relative",
                          message.isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}>
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                          {message.files && message.files.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.files.map((file) => (
                                <div
                                  key={file.id}
                                  className={cn(
                                    "flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-background/10",
                                    message.isCurrentUser
                                      ? "border-primary-foreground/20"
                                      : "border-border"
                                  )}
                                  onClick={() => handleDownloadFile(file)}
                                >
                                  {getFileIcon(file.type)}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{file.name}</p>
                                    <p className="text-xs opacity-70">{formatFileSize(file.size)}</p>
                                  </div>
                                  <Download className="w-4 h-4 opacity-70" />
                                </div>
                              ))}
                            </div>
                          )}
                          <span className={cn(
                            "text-xs block mt-1",
                            message.isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}>
                            {message.timestamp}
                          </span>
                        </div>
                        {message.isCurrentUser && (
                          <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditMessage(message)}>
                                  <Edit2 className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleForwardMessage()}>
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Forward
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteMessage(message)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="border-t p-3 space-y-2 flex-shrink-0">
              {editingMessage && (
                <div className="flex items-center justify-between bg-muted px-3 py-2 rounded text-sm">
                  <span className="text-muted-foreground">Editing message</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setEditingMessage(null);
                      setMessageInput('');
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-muted rounded px-2 py-1">
                      {getFileIcon(file.type)}
                      <span className="text-xs max-w-[150px] truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4"
                        onClick={() => handleRemoveFile(idx)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-end gap-2">
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 flex-shrink-0"
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="start">
                    <div className="p-2 border-b">
                      <p className="text-xs font-medium text-muted-foreground">Emojis</p>
                    </div>
                    <ScrollArea className="h-64">
                      <div className="grid grid-cols-9 gap-1 p-2">
                        {emojis.map((emoji, idx) => (
                          <Button
                            key={idx}
                            variant="ghost"
                            className="h-9 w-9 p-0 text-xl hover:bg-muted"
                            onClick={() => handleEmojiSelect(emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 flex-shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Textarea
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="min-h-9 max-h-32 resize-none"
                  rows={1}
                />
                <Button
                  size="icon"
                  className="h-9 w-9 flex-shrink-0"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() && attachedFiles.length === 0}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
          )}
        </div>
      </div>

      {/* Create Group Dialog */}
      <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Group Name</Label>
              <Input
                placeholder="e.g., Sales Team"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Members</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between h-9"
                  >
                    {selectedMembers.length > 0
                      ? `${selectedMembers.length} members selected`
                      : "Select members..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search members..." />
                    <CommandList>
                      <CommandEmpty>No member found.</CommandEmpty>
                      <CommandGroup heading="Team Members">
                        {availableTeamMembers.map((member) => (
                          <CommandItem
                            key={member.id}
                            onSelect={() => toggleMember(member.id)}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedMembers.includes(member.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {member.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandGroup heading="Clients">
                        {availableClients.map((client) => (
                          <CommandItem
                            key={client.id}
                            onSelect={() => toggleMember(client.id)}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedMembers.includes(client.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {client.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {selectedMembers.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Members ({selectedMembers.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((memberId) => {
                    const member = [...availableTeamMembers, ...availableClients].find(m => m.id === memberId);
                    return member ? (
                      <Badge key={memberId} variant="secondary" className="gap-1">
                        {member.name}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => toggleMember(memberId)}
                        />
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateGroupOpen(false);
              setGroupName('');
              setSelectedMembers([]);
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateGroup}>Create Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Forward Message Dialog */}
      <Dialog open={isForwardDialogOpen} onOpenChange={setIsForwardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forward Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Forward To</Label>
              <Input
                placeholder="Search chats..."
                value={forwardTo}
                onChange={(e) => setForwardTo(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={confirmForward} disabled={!forwardTo}>Forward</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </DashboardLayout>
  );
}
