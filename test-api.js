const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nihvcwmqmuxxnxizaoec.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5paHZjd21xbXV4eG54aXphb2VjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTMxMzU3NiwiZXhwIjoyMDg2ODg5NTc2fQ.inakZtgtDV9ZJHxgMvbAEBCnljS3MP7prsYAtdq7K5I'
);

(async () => {
  console.log('Testing different query methods...\n');

  // Method 1: Select all columns with *
  console.log('Method 1: select("*")');
  const { data: data1, error: error1 } = await supabase
    .from('works')
    .select('*')
    .eq('id', '0ef5bbfc-486a-4ca8-b246-a0bc2038cfab')
    .single();
  console.log('Tags:', data1?.tags);
  console.log('Error:', error1);
  console.log('');

  // Method 2: Explicit column selection
  console.log('Method 2: Explicit columns');
  const { data: data2, error: error2 } = await supabase
    .from('works')
    .select('id, title, tags')
    .eq('id', '0ef5bbfc-486a-4ca8-b246-a0bc2038cfab')
    .single();
  console.log('Tags:', data2?.tags);
  console.log('Error:', error2);
  console.log('');

  // Method 3: With JOIN
  console.log('Method 3: With profiles JOIN');
  const { data: data3, error: error3 } = await supabase
    .from('works')
    .select('id, title, tags, profiles:user_id(id, nickname)')
    .eq('id', '0ef5bbfc-486a-4ca8-b246-a0bc2038cfab')
    .single();
  console.log('Tags:', data3?.tags);
  console.log('Error:', error3);
})();
