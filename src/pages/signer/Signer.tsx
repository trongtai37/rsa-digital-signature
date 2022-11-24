import * as React from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  FormProps,
  notification,
  Typography,
} from 'antd';
import {
  digestDocument,
  exportPrivateKey,
  exportPublicKey,
  generateRSAKeyPair,
  sign,
} from '../../utils/crypto';
import useCopyToClipboard from '../../utils/useCopyToClipboard';

interface SignerFormValues {
  document: string;
  hash_function: string;
  key_length: number;
  public_key: string;
  private_key: string;
  signature: string;
}

const initialFormValues: SignerFormValues = {
  document: '',
  hash_function: 'SHA-256',
  key_length: 1024 * 2,
  public_key: '',
  private_key: '',
  signature: '',
};

const Signer = () => {
  const [form] = Form.useForm<SignerFormValues>();
  const [isGenerating, setGenerating] = React.useState(false);
  const [, copyToClipboard] = useCopyToClipboard();

  const onFinish: FormProps<SignerFormValues>['onFinish'] = async (values) => {
    try {
      setGenerating(true);
      const { document, hash_function, key_length } = values;

      const hashedDocument = await digestDocument(document, hash_function);
      const { publicKey, privateKey } = await generateRSAKeyPair(key_length);
      const signature = await sign(privateKey, hashedDocument);

      form.setFieldsValue({
        public_key: await exportPublicKey(publicKey),
        private_key: await exportPrivateKey(privateKey),
        signature: signature,
      });
    } catch (error) {
      if (error instanceof Error) {
        notification.error({
          message: error.message,
        });
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ padding: 16, paddingLeft: 16 * 5 }}>
      <Typography.Title style={{ textAlign: 'center' }} level={2}>
        Signer
      </Typography.Title>
      <Form
        layout="horizontal"
        form={form}
        onFinish={onFinish}
        initialValues={initialFormValues}
        wrapperCol={{
          span: 16,
        }}
        labelCol={{
          span: 4,
        }}
      >
        <Form.Item
          label="Document"
          name="document"
          rules={[
            {
              required: true,
              message: 'Document can not be empty.',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Hash function" name="hash_function" required>
          <Select>
            <Select.Option value="SHA-256">SHA-256</Select.Option>
            <Select.Option value="SHA-512">SHA-512</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="RSA Key Length" name="key_length" required>
          <Select>
            <Select.Option value={1024 * 2}>2048-bit</Select.Option>
            <Select.Option value={1024 * 3}>3072-bit</Select.Option>
            <Select.Option value={1024 * 4}>4096-bit</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="  " colon={false}>
          <Button htmlType="submit" type="primary" loading={isGenerating}>
            Generate
          </Button>
        </Form.Item>

        <Form.Item
          label="Public Key"
          name="public_key"
          extra={
            <Button
              onClick={() => copyToClipboard(form.getFieldValue('public_key'))}
              style={{ marginTop: 4 }}
            >
              Copy
            </Button>
          }
        >
          <Input.TextArea readOnly rows={3} showCount />
        </Form.Item>

        <Form.Item
          label="Private Key"
          name="private_key"
          extra={
            <Button
              onClick={() => copyToClipboard(form.getFieldValue('private_key'))}
              style={{ marginTop: 4 }}
            >
              Copy
            </Button>
          }
        >
          <Input.TextArea readOnly rows={3} showCount />
        </Form.Item>

        <Form.Item
          label="Signature"
          name="signature"
          extra={
            <Button
              onClick={() => copyToClipboard(form.getFieldValue('signature'))}
              style={{ marginTop: 4 }}
            >
              Copy
            </Button>
          }
        >
          <Input.TextArea readOnly rows={3} showCount />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signer;
