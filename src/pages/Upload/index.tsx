import { ProCard, ProForm, ProFormUploadDragger } from '@ant-design/pro-components';
import { Alert, message, Progress, Table, Typography } from 'antd';
import { InboxOutlined, FileTextOutlined } from '@ant-design/icons';
import { useSnapshot } from 'valtio';
import { useState } from 'react';
import { marketStore, marketActions } from '@/stores/market.store';

const { Title, Paragraph } = Typography;

export default function UploadPage() {
  const snap = useSnapshot(marketStore);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleUpload = async (values: any) => {
    const file = values.file?.[0]?.originFileObj;
    if (!file) {
      message.error('Please select a file');
      return;
    }

    try {
      await marketActions.uploadCSV(file);
      setPreviewData([]);
    } catch (error) {
      // Error handled in store
    }
  };

  const handleFileChange = (info: any) => {
    const file = info.file.originFileObj;
    if (file && file.type === 'text/csv') {
      // Simple CSV preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').slice(0, 6); // First 5 rows + header
        const headers = lines[0].split(',');
        const preview = lines.slice(1).map((line, index) => {
          const values = line.split(',');
          const row: any = { key: index };
          headers.forEach((header, i) => {
            row[header.trim()] = values[i]?.trim();
          });
          return row;
        });
        setPreviewData(preview);
      };
      reader.readAsText(file);
    }
  };

  const columns = previewData.length > 0
    ? Object.keys(previewData[0])
        .filter(key => key !== 'key')
        .map(key => ({
          title: key,
          dataIndex: key,
          key: key,
          ellipsis: true,
        }))
    : [];

  return (
    <ProCard ghost gutter={[16, 16]}>
      <ProCard colSpan={24}>
        <Alert
          message="CSV Upload Instructions"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>File must be in CSV format with comma separators</li>
              <li>Required columns: Date, Symbol, Open, High, Low, Close, Volume</li>
              <li>Date format: YYYY-MM-DD</li>
              <li>Maximum file size: 10MB</li>
            </ul>
          }
          type="info"
          showIcon
          icon={<FileTextOutlined />}
        />
      </ProCard>

      <ProCard colSpan={12} title="Upload CSV">
        <ProForm
          onFinish={handleUpload}
          submitter={{
            searchConfig: {
              submitText: 'Upload & Process',
            },
            resetButtonProps: {
              style: { display: 'none' },
            },
          }}
        >
          <ProFormUploadDragger
            name="file"
            label="Drag & Drop CSV File"
            title="Click or drag CSV file to this area"
            description="Support for Mirae Asset CSV format"
            icon={<InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />}
            rules={[{ required: true, message: 'Please select a file' }]}
            fieldProps={{
              accept: '.csv',
              multiple: false,
              maxCount: 1,
              onChange: handleFileChange,
              beforeUpload: (file) => {
                const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
                if (!isCSV) {
                  message.error('You can only upload CSV files!');
                  return false;
                }
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isLt10M) {
                  message.error('File must be smaller than 10MB!');
                  return false;
                }
                return false; // Prevent auto upload
              },
            }}
          />
        </ProForm>

        {snap.uploadProgress > 0 && (
          <Progress
            percent={snap.uploadProgress}
            status={snap.uploadProgress === 100 ? 'success' : 'active'}
            style={{ marginTop: 16 }}
          />
        )}
      </ProCard>

      <ProCard colSpan={12} title="Preview">
        {previewData.length > 0 ? (
          <>
            <Paragraph type="secondary">
              Showing first 5 rows of your CSV file
            </Paragraph>
            <Table
              columns={columns}
              dataSource={previewData}
              pagination={false}
              size="small"
              scroll={{ x: true }}
            />
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>
            <InboxOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <div>Select a CSV file to preview data</div>
          </div>
        )}
      </ProCard>

      <ProCard colSpan={24} title="Sample CSV Format">
        <pre style={{ 
          background: '#f5f5f5', 
          padding: 16, 
          borderRadius: 4,
          overflow: 'auto' 
        }}>
{`Date,Symbol,Open,High,Low,Close,Volume
2024-01-15,BBCA.JK,8550,8600,8500,8575,15234000
2024-01-16,BBCA.JK,8575,8625,8550,8600,18456000
2024-01-17,BBCA.JK,8600,8650,8575,8625,12789000`}
        </pre>
      </ProCard>
    </ProCard>
  );
}