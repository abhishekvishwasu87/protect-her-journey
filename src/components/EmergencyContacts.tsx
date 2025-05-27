
import { useState, useEffect } from "react";
import { Phone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

const EmergencyContacts = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load emergency contacts.",
        variant: "destructive",
      });
    }
  };

  const handleAddContact = async () => {
    if (newContact.name && newContact.phone && user) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('emergency_contacts')
          .insert({
            user_id: user.id,
            name: newContact.name,
            phone: newContact.phone,
            relationship: newContact.relationship,
          });

        if (error) throw error;

        await fetchContacts();
        setNewContact({ name: '', phone: '', relationship: '' });
        setShowAddForm(false);
        toast({
          title: "Contact Added",
          description: `${newContact.name} has been added to your emergency contacts.`,
        });
      } catch (error: any) {
        console.error('Error adding contact:', error);
        toast({
          title: "Error",
          description: "Failed to add emergency contact.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchContacts();
      toast({
        title: "Contact Removed",
        description: "Emergency contact has been removed.",
      });
    } catch (error: any) {
      console.error('Error removing contact:', error);
      toast({
        title: "Error",
        description: "Failed to remove emergency contact.",
        variant: "destructive",
      });
    }
  };

  const handleCallContact = (contact: Contact) => {
    window.open(`tel:${contact.phone}`, '_self');
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-purple-500" />
            <span>Emergency Contacts</span>
          </div>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Enter contact name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={newContact.relationship}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                placeholder="e.g., Friend, Family, Partner"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleAddContact} 
                size="sm" 
                className="bg-green-500 hover:bg-green-600"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Contact"}
              </Button>
              <Button 
                onClick={() => setShowAddForm(false)} 
                size="sm" 
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{contact.name}</h4>
                <p className="text-sm text-gray-600">{contact.phone}</p>
                {contact.relationship && (
                  <p className="text-xs text-purple-600">{contact.relationship}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleCallContact(contact)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemoveContact(contact.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {contacts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Phone className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No emergency contacts added yet.</p>
            <p className="text-sm">Add contacts to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts;
